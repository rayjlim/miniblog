import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars


const AddForm = (props) => {


    console.log('props :', props);
    const [ content, setContent ] = useState('');
	const [ entryForm, setEntryForm ] = useState('a');

	useEffect(() => {
		console.log('AddForm: useEffect');
	
	}, []);


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
                            <textarea className="form-control" placeholder="Add ..." rows="6" />
                        </div>
                 {/*         <div className="form-group">
                            <input
                                type="text"
                                ref="date"
                                className="form-control"
                                placeholder="Add date..."
                                defaultValue={props.date}
                            />
        
                            {/* {formBtns} */}
                       {/* </div> */}
                        {/* <button onClick={this.handleAdd} className="btn btn-primary">
                            Submit
                        </button>
                        <button onClick={this.props.clear} className="btn btn-warning pull-right">
                            Cancel
                        </button> */}
                    </div>
                );
}
//     constructor(props) {
//         super(props);
//         // create a ref to store the textInput DOM element
//         this.handleTemplate = this.handleTemplate.bind(this);
//         this.handleAdd = this.handleAdd.bind(this);
//         this.minusYear = this.minusYear.bind(this);
//         this.minusDay = this.minusDay.bind(this);
//         this.addFAtag = this.addFAtag.bind(this);
//     }
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

//     handleAdd(e) {
//         const entry = {
//             content: this.refs.content.value.trim(),
//             date: this.refs.date.value.trim()
//         };
//         this.props.submit(entry);
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
