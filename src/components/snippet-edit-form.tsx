'use client';
import type { Snippet } from "@prisma/client"
import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import * as actions from '@/actions'

// Turns out that Prisma itself already defines interfaces of all these different records that we have
interface SnippetEditFormProps{
    snippet: Snippet
}
function SnippetEditForm({ snippet }: SnippetEditFormProps) { //destructered snippet from props
    const [code, setcode] = useState(snippet.code)
    const editSnippetAction = actions.editSnippet.bind(null, snippet.id, code) // this is how server actions are loaded in the client.(Conventional way). You could also use
                                                                                // normal react way (handleeditclick) just wrap it up in startTransition function so that rerender
                                                                                // is done only after the updation

    const handleEditorChange = (value: string="")=>{
        setcode(value)
    }
    return <div>
        <Editor
            height="40vh"
            theme="vs-dark"
            language="javascript"
            defaultValue={snippet.code}
            options={{ minimap: { enabled: false } }}
            onChange={handleEditorChange}
        />
        <form action={editSnippetAction}>
            <button type="submit">
                Save
            </button>
        </form>
    </div>;
}

export default SnippetEditForm
