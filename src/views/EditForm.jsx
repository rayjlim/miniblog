import React from 'react'; // eslint-disable-line no-unused-vars
import ReactMarkdown from 'react-markdown'; // eslint-disable-line no-unused-vars
import moment from 'moment';

class EditForm extends React.Component {
    constructor(props) {
        super(props);
        // create a ref to store the textInput DOM element

        this.save = this.save.bind(this);
        this.subToDate = this.subToDate.bind(this);
        this.addToDate = this.addToDate.bind(this);
        this.addFAtag = this.addFAtag.bind(this);
        this.state = {
            textarea: this.props.entry.date
        }
    }

    textChange(event){
        event.preventDefault()
        console.log(this.state);
    }

    render() {
        let templateStyle = {
            float: 'right'
        };
        let escapedContent = this.props.entry.content.replace(
            /<br\s*\/>/g,
            `
`
        );

        return (
            <div className="well">
                <button onClick={this.addFAtag} className="btn btn-info" style={templateStyle}>
                    fa-template
                </button>
                <strong>Edit Entry</strong>
                <p>
                    link: [link text](URL){' '}
                    <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#links">Cheatsheet</a>
                </p>
                <div className="form-group">
                    <textarea
                        ref='content'
                        onChange={e => {
                            this.setState({ textarea: e.target.value })
                            this.textChange(event)
                        }}
                        className="form-control"
                        placeholder="Add ..."
                        rows="8"
                        defaultValue={escapedContent}
/>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        ref="date"
                        onChange={(event) => event.preventDefault()}
                        className="form-control"
                        placeholder="Edit Date..."
                        value={this.props.entry.date}
                    />
                </div>

                <button onClick={this.subToDate} className="btn btn-info">
                    subToDate
                </button>
                <button onClick={this.addToDate} className="btn btn-success">
                    addToDate
                </button>

                <button onClick={this.save} className="btn btn-primary">
                    Save
                </button>

                <button onClick={this.props.clear} className="btn btn-warning pull-right">
                    Cancel
                </button>
                <button onClick={this.props.delete} className="btn btn-danger pull-right" id={this.props.entry.id}>
                    Delete
                </button>

                <ReactMarkdown source={this.state.textarea} escapeHtml={false} />
            </div>
        );
    }

    save(e) {
        const entry = {
            id: this.props.entry.id,
            content: this.refs.content.value.trim(),
            date: this.refs.date.value.trim()
        };
        this.props.submit(entry);
    }

    subToDate(e) {
        this.refs.date.value = moment(this.refs.date.value.trim()).subtract(1, 'days').format('YYYY-MM-DD');
    }

    addToDate(e) {
        this.refs.date.value = moment(this.refs.date.value.trim()).add(1, 'days').format('YYYY-MM-DD');
    }

    addFAtag(e) {
        this.refs.content.value += ` 
<i class="fas fa-" /> `;
    }
}

export default EditForm;
