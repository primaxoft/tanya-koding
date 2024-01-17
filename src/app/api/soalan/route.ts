import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { revalidatePath } from 'next/cache';
import { getResponseInit } from '@/utils/response-init';
import { prisma } from '@/db/db';
import { createQuestionSchema } from '@/zod/schemas';
import { isValidObjectId } from '@/utils/object-id';
import { chatGPTApi, FailureMessage, Prompt, removeQuotes } from '@/utils/chatgpt';

export async function GET(request: NextRequest) {
  const paramCursor = request.nextUrl.searchParams.get('cursor');

  const cursor = isValidObjectId(paramCursor ?? '') ? paramCursor : null;

  try {
    const questions = await prisma.question.findMany({
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        askedOn: 'desc',
      },
      skip: cursor ? 1 : 0,
      take: 10,
    });

    return NextResponse.json(
      {
        errors: null,
        questions,
      },
      getResponseInit(StatusCodes.OK)
    );
  } catch (error) {
    console.log(error);
    // Todo: Add sentry here
    return NextResponse.json(
      {
        errors: {
          server: 'database error',
        },
        questions: null,
      },
      getResponseInit(StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
}

export async function POST(request: NextRequest) {
  const body: unknown = await request.json();

  const result = createQuestionSchema.safeParse(body);
  if (!result.success) {
    let zodErrors = {};
    result.error.issues.forEach(issue => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
    return NextResponse.json(
      {
        errors: zodErrors,
      },
      getResponseInit(StatusCodes.BAD_REQUEST)
    );
  }

  const { question } = result.data;

  let message: string;
  try {
    const res = await chatGPTApi.sendMessage(Prompt.QuestionReceived);
    message = removeQuotes(res.text);
  } catch (error) {
    console.log(error);
    message = FailureMessage.QuestionReceived;
  }

  try {
    await prisma.question.create({
      data: {
        question,
      },
    });

    revalidatePath('/senarai-soalan/');

    return NextResponse.json(
      {
        error: false,
        message,
      },
      getResponseInit(StatusCodes.CREATED)
    );
  } catch (error) {
    console.log(error);
    // Todo: Add sentry here
    return NextResponse.json(
      {
        error: true,
        errors: {
          server: 'database error',
        },
      },
      getResponseInit(StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
}
