import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import constants from '../constants';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; // eslint-disable-line no-unused-vars

const EditForm = (props) => {
	// class EditForm extends Component {
	//     constructor(props) {
	//         super(props);
	//         // create a ref to store the textInput DOM element

	//         this.save = this.save.bind(this);
	//         this.subToDate = this.subToDate.bind(this);
	//         this.addToDate = this.addToDate.bind(this);
	//         this.addFAtag = this.addFAtag.bind(this);
	//     }
	let escapedContent = props.entry.content.replace(
		/<br\s*\/>/g,
		`
`
	);
	const [ date, setDate ] = useState(props.entry.date);
	const [ content, setContent ] = useState(escapedContent);

	function handleSave() {
		const entry = {
			content,
			date // TODO: check date format
		};
		console.log('axios entry :', entry);
        const options = {
            method: 'PUT',
           };
        axios.put(`${constants.REST_ENDPOINT}api/posts/${props.entry.id}`,
        entry
        ,options)
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
				// alert(error);
				props.onSuccess();
			});
	}

	return (
		<div className="well">
			{/* <button onClick={this.addFAtag} className="btn btn-info" style={templateStyle}>
                    fa-template
                </button> */}
			<strong>Edit Entry</strong>
			<p>
				link: [link text](URL){' '}
				<a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#links">Cheatsheet</a>
			</p>
			{props.entry.id}
			<div className="form-group">
				<textarea
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
				Save
			</button>

			<button onClick={handleClear} className="btn btn-warning pull-right">
				Cancel
			</button>
			<button onClick={handleDelete} className="btn btn-danger pull-right">
				Delete
			</button>
            <ReactMarkdown source={content} escapeHtml={false} />

           
		</div>
	);
};

//     save(e) {
//         const entry = {
//             id: props.entry.id,
//             content: this.refs.content.value.trim(),
//             date: this.refs.date.value.trim()
//         };
//         props.submit(entry);
//     }

//     subToDate(e) {
//         this.refs.date.value = moment(this.refs.date.value.trim()).subtract(1, 'days').format('YYYY-MM-DD');
//     }

//     addToDate(e) {
//         this.refs.date.value = moment(this.refs.date.value.trim()).add(1, 'days').format('YYYY-MM-DD');
//     }

//     addFAtag(e) {
//         this.refs.content.value += `
// <i class="fas fa-" /> `;
//     }
// }

export default EditForm;
