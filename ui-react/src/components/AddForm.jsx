import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import constants from '../constants';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; // eslint-disable-line no-unused-vars

const AddForm = (props) => {
	// console.log('props :', props);
	const [ content, setContent ] = useState(props.content||'');
	const [ date, setDate ] = useState(props.date);

	useEffect(() => {
		console.log('AddForm: useEffect');
	}, []);

	function contentChange(e) {
		e.preventDefault();
		// console.log('e.target.value :', e.target.value);
		setContent(e.target.value);
	}
	function dateChange(e) {
		e.preventDefault();
		console.log('e.target.value :', e.target.value);
		setDate(e.target.value);
	}

    function handleAdd(e) {
        console.log('this :', this);
        const entry = {
            content: content.trim(),
            date: date.trim()  // TODO: check date format
        };
        axios
        .post( `${constants.REST_ENDPOINT}api/posts/`, JSON.stringify(entry))
        .then((response) => {
            console.log(response);
            // $('.toast').toast('dispose');
            // $('.toast-body').html('Saved');
            // $('.toast').toast({ delay: 4000 });
            // $('.toast').toast('show');
            // TODO: clear the fields
            props.onSuccess();
        })
        .catch((error) => {
            console.log(error);
            alert(error);
        });
    }

    function clear(){
        console.log('clear form');
        props.onSuccess();
    }

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
				<textarea className="form-control" 
					placeholder="Add ..." 
					rows="6" 
					onChange={(e) => contentChange(e)}
					defaultValue={props.content} />
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
		

            <ReactMarkdown source={content} escapeHtml={false} />
                    {/* {formBtns} */}
			 <button onClick={handleAdd} className="btn btn-primary">
                    Submit
                </button>
                <button onClick={clear} className="btn btn-warning pull-right">
                    Cancel
                </button>
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
// <i class="fas fa-" /> `;
//     }
// }

export default AddForm;






