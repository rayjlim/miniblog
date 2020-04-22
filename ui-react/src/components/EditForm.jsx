import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import constants from '../constants';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; // eslint-disable-line no-unused-vars

const EditForm = (props) => {
	let escapedContent = props.entry.content.replace(
		/<br\s*\/>/g,
		`
`
    );
    let textareaInput = null;
    function setTextInputRef(element){
        textareaInput = element
    }
	const [ date, setDate ] = useState(props.entry.date);
	const [ content, setContent ] = useState(escapedContent);

	function handleSave() {
		const entry = {
			content,
			date // TODO: check date format
		};
		console.log('axios entry :', entry);
	
		axios
			.put(`${constants.REST_ENDPOINT}api/posts/${props.entry.id}`, entry)
			.then((response) => {
				console.log(response);
				// $('.toast').toast('dispose');
				// $('.toast-body').html('Updated The Entry');
				// $('.toast').toast({ delay: 4000 });
				// $('.toast').toast('show');
				props.onSuccess();
			})
			.catch((error) => {
				console.log(error);
				alert(error);
			});
	}
	function handleClear() {
		props.onSuccess();
	}

	let templateStyle = {
		float: 'right'
	};

	function handleDelete() {
		console.log('handleDelete ' + props.entry.id);
		axios
			.delete(`${constants.REST_ENDPOINT}api/posts/${props.entry.id}`)
			.then((response) => {
				console.log(response);
				// $('.toast').toast('dispose');
				// $('.toast-body').html('Removed Entry');
				// $('.toast').toast({ delay: 4000 });
				// $('.toast').toast('show');
				props.onSuccess();
			})
			.catch((error) => {
				console.log(error);
				alert(error);
				
			});
	}

	function addFAtag(e) {
		textareaInput.value += `
<i class="fa fa-" /> `;
	}

	return (
		<div className="well">
			{/* <button onClick={this.addFAtag} className="btn btn-info" style={templateStyle}>
                    fa-template
                </button> */}
			<strong>Edit Entry</strong>
			<button onClick={(e) => addFAtag(e)} className="btn btn-info" style={templateStyle}>
			<i class="fa fa-font-awesome" />fa-template
			</button>
			<p>
				link: [link text](URL){' '}
				<a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#links">Cheatsheet</a>
			</p>
			
			<div className="form-group">
				<textarea
					ref={setTextInputRef}
					onChange={(event) => setContent(event.target.value)}
					className="form-control"
					placeholder="Add ..."
					rows="8"
					defaultValue={escapedContent}
				/>
			</div>
			<div className="form-group">
				<input
					type="text"
					onChange={(event) => setDate(event.target.value)}
					className="form-control"
					placeholder="Edit Date..."
					defaultValue={props.entry.date}
				/>
			</div>

			{/* <button onClick={this.subToDate} className="btn btn-info">
                    subToDate
                </button>
                <button onClick={this.addToDate} className="btn btn-success">
                    addToDate
                </button> */}

			<button onClick={handleSave} className="btn btn-primary">
			<i class="fa fa-save" /> Save
			</button>

			<button onClick={handleClear} className="btn btn-warning pull-right">
			<i class="fa fa-ban" /> Cancel
			</button>
			<button onClick={handleDelete} className="btn btn-danger pull-right">
			<i class="fa fa-trash" /> Delete
			</button>
			<div className="markdownDisplay">
				<ReactMarkdown source={content} escapeHtml={false} />
			</div>
		</div>
	);
};

export default EditForm;





