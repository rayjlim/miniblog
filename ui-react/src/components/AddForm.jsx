import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import constants from '../constants';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; // eslint-disable-line no-unused-vars

const AddForm = (props) => {
	console.log('props :', props.content);
	const [ content, setContent ] = useState(props.content);
	const [ date, setDate ] = useState(props.date);
    let textareaInput = null;

	useEffect(
		() => {
			console.log('AddForm: useEffect');
			setContent(props.content || '');
		},
		[ props ]
	);

	function textChange (text){
		const pattern = /\@\@([\w\-]*)\@\@/g;
		const replacement = '<i class="fa fa-\$1" />';
		textareaInput.value = textareaInput.value.replace(pattern, replacement);

		setContent(textareaInput.value);
	}

	function dateChange(e) {
		e.preventDefault();
		console.log('e.target.value :', e.target.value);
		setDate(e.target.value);
	}

	function handleAdd(e) {
		(async () => {
			console.log('this :', this);
			const entry = {
				content: content.trim(),
				date: date.trim() // TODO: check date format
			};
			try {
				const result = await axios.post(`${constants.REST_ENDPOINT}api/posts/`, JSON.stringify(entry));

				setContent('');
				console.log('new id :>> ', result.data.id);
				props.onSuccess(e);
			} catch (error) {
				console.log(error);
				alert(error);
			}
		})();
	}

	function clear() {
		console.log('clear form');
		props.onSuccess();
	}
	console.log('content :>> ', content);
	return (
		<div className="well">
			{/* <button onClick={this.handleTemplate} className="btn btn-primary" style={templateStyle}>
                    Template
                </button>
                <button onClick={this.addFAtag} className="btn btn-info" style={templateStyle}>
                    fa-template
                </button> */}
			<strong>Add Entry</strong>
			<p>
				link: [link text](URL){' '}
				<a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#links">Cheatsheet</a>
			</p>

			<div className="form-group">
				<textarea
					ref={elem=> textareaInput = elem}
					rows="6"
					onChange={(event) => textChange(event.target.value)}
					className="form-control"
					placeholder="Add ..."
					defaultValue={props.content}
				/>
			</div>

			<div className="form-group">
				<input
					type="text"
					onChange={(e) => dateChange(e)}
					className="form-control"
					placeholder="Add date..."
					defaultValue={props.date}
				/>
			</div>

			<button onClick={handleAdd} className="btn btn-primary">
				<i className="fa fa-save" /> Submit
			</button>
			<button onClick={clear} className="btn btn-warning pull-right">
				<i className="fa fa-ban" /> Cancel
			</button>
			<div className="markdownDisplay">
				<ReactMarkdown source={content} escapeHtml={false} />
			</div>
		</div>
	);
};

//     render() {
//         let templateStyle = {
//             float: 'right'
//         };
//         let formBtns = '';
//         if (this.props.showDateModBtns != null) {
//             formBtns = (
//                 <div>
//                     <button onClick={this.minusYear} className="btn">
//                         Minus a year
//                     </button>
//                     <button onClick={this.minusDay} className="btn">
//                         Minus a day
//                     </button>
//                 </div>
//             );
//         }
//
//     }

//     minusYear(e) {
//         let currDate = new Date(this.refs.date.value);
//         let year = currDate.getFullYear();
//         let month = `${currDate.getMonth() + 1}`.lpad('0', 2);
//         let day = `${currDate.getDate() + 1}`.lpad('0', 2);

//         this.refs.date.value = `${year - 1}-${month}-${day}`;
//     }

//     minusDay(e) {
//         console.log('this.refs.date.value :', this.refs.date.value);
//         let currDate = new Date(this.refs.date.value);
//         let year = currDate.getFullYear();
//         let month = `${currDate.getMonth() + 1}`.lpad('0', 2);
//         let day = `${currDate.getDate() }`.lpad('0', 2);

//         this.refs.date.value = `${year}-${month}-${day}`;
//     }

//     handleTemplate(e) {
//         this.refs.content.value += `
// ### Tomorrow

// ### Obstacles
//     `;
//     }

//     addFAtag(e) {
//         this.refs.content.value += `
// <i className="fas fa-" /> `;
//     }
// }

export default AddForm;
