/* Licensing for GNU General Public License 2.0 or greater */
/*  The South End is a Website and CMS to publish news articles
    Copyright (C) 2021  The South End

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import React, { useState } from "react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

function AdvancedEditor (props) {
    const [showHelp, setShowHelp] = useState(false)

    // The help text display
    const help = (
        <div className="editor-help">
            <p>Insert Image</p>
            <p className="help">
                Copy image address or URL and paste directly into editor. A caption can be added to the image from
                within the editor.
            </p>
            <p>Embed YouTube Video</p>
            <p className="help">
                On YouTube, click the "Share" button for the desired video and then chose the "Embed" option. Copy the
                generated HTML code and then select the "Insert HTML" option within the editor to add a field to embed
                the content. Paste the copied code into this field and then click the green checkmark to save changes.
            </p>
            <p>Embed Tweet</p>
            <p className="help">
                Copy the URL to the desired tweet and paste that link in the embedded content generator on <a href="https://publish.twitter.com/#" target="_blank" rel="noreferrer">Twitter's Publish Site</a>.
                Apply any desired customizations and then copy the generated HTML code snippet. Within the editor, select
                the "Insert HTML" option and paste the copied code into the field, then click the green checkmark to save
                changes.
            </p>
            <p>Embed SoundCloud Audio</p>
            <p className="help">
                For the desired audio clip on SoundCloud, click the "Share" button and then switch to the "Embed" tab within
                the share popup. Apply any desired configurations, including appearance, size, and color for the embedded content.
                Copy the generated code and paste that code within the editor after selecting the "Insert HTML" option,
                then click the green checkmark to save changes.
            </p>
        </div>
    )

    const editorConfiguration = {
        toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            '|',
            'undo',
            'redo',
            '|',
            'htmlEmbed'
        ]
    }

    return (
        <div className="advanced-editor">
            <CKEditor
                editor={ Editor }
                config={editorConfiguration}
                data={props.initialContent}
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    props.setContent(data);
                } }
            />
            <p className="help-text">
                {props.helpText}
                {showHelp ?
                    <span><i className="far fa-times-circle fa-2x" onClick={() => setShowHelp(false)}/></span>
                    : <span><i className="far fa-question-circle fa-2x" onClick={() => setShowHelp(true)}/></span>
                }
            </p>
            {showHelp ? help : null}
        </div>
    )
}

export default AdvancedEditor