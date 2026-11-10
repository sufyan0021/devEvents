import connectDB from '@/lib/mongodb';
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import Event from '@/database/event.model';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const event = Object.fromEntries(formData.entries());
    const image = formData.get('image');

    if (image === null) {
      return NextResponse.json(
        { message: 'Image file is required' },
        { status: 400 },
      );
    }

    if (!(image instanceof File)) {
      return NextResponse.json(
        { message: 'Image must be an uploaded file' },
        { status: 400 },
      );
    }

    if (image.size === 0 || image.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { message: 'Image must be greater than 0 bytes and no larger than 5 MB' },
        { status: 400 },
      );
    }

    const tagsValue = formData.get('tags');
    const agendaValue = formData.get('agenda');

    if (typeof tagsValue !== 'string' || typeof agendaValue !== 'string') {
      return NextResponse.json(
        { message: 'Tags and agenda are required as JSON arrays' },
        { status: 400 },
      );
    }

    let tags: unknown;
    let agenda: unknown;
    try {
      tags = JSON.parse(tagsValue);
    } catch {
      return NextResponse.json(
        { message: 'Tags must be a valid JSON array of strings' },
        { status: 400 },
      );
    }

    try {
      agenda = JSON.parse(agendaValue);
    } catch {
      return NextResponse.json(
        { message: 'Agenda must be a valid JSON array of strings' },
        { status: 400 },
      );
    }

    if (!isStringArray(tags) || tags.length === 0) {
      return NextResponse.json(
        { message: 'Tags must be a non-empty JSON array of strings' },
        { status: 400 },
      );
    }

    if (!isStringArray(agenda) || agenda.length === 0) {
      return NextResponse.json(
        { message: 'Agenda must be a non-empty JSON array of strings' },
        { status: 400 },
      );
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: 'image', folder: 'DevEvent' },
          (error, results) => {
            if (error) return reject(error);

            resolve(results);
          },
        )
        .end(buffer);
    });

    event.image = (uploadResult as { secure_url: string }).secure_url;

    const createdEvent = await Event.create({
      ...event,
      tags: tags,
      agenda: agenda,
    });

    return NextResponse.json(
      { message: 'Event created successfully', event: createdEvent },
      { status: 201 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: 'Event Creation Failed',
        error: e instanceof Error ? e.message : 'Unknown',
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { message: 'Events fetched successfully', events },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      { message: 'Event fetching failed', error: e },
      { status: 500 },
    );
  }
}
