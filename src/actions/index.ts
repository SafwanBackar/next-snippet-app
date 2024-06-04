'use server';

import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSnippet(formState: { message: string}, formData: FormData){
    try {
        const title = formData.get('title');
        const code = formData.get('code');
    
        if (typeof title !== 'string' || title.length < 3) {
            return {
                message: 'Title must be longer',
            };
        }
        if (typeof code !== 'string' || code.length < 10) {
            return {
                message: 'Code must be longer',
            };
        }

        await db.snippet.create({
            data: { title, code },
        });
        } catch (err: unknown) {
            if (err instanceof Error) {
                return {
                    message: err.message,
                };
            } else {
                return {
                    message: 'Something went wrong...',
                };
            }
        }
        revalidatePath('/') // updates the cache for home page since home page will be configured as static page by next in productino. will not be visible or needed in dev mode.
        redirect('/');
}

export async function editSnippet(id: number, code: string){
    await db.snippet.update({
        where: {id },
        data: { code }
    })
    revalidatePath(`/snippets/${id}`) // this is a dynamic path. So why revalidate required? Because in the show page of snippet, we defined generateStaticParams which will
                                        // cache already availble data and next will not update and give back static data. so revalidata required. Again, only in prod mode.
    redirect(`/snippets/${id}`)
}

export async function deleteSnippet(id: number){
    await db.snippet.delete({
        where: {id }
    })
    revalidatePath('/') 
    redirect(`/`)
}