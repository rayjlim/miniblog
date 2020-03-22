import React from 'react'; // eslint-disable-line no-unused-vars
const EntryDialog = (props) => {
    console.log('ED: render');
    return (
        <div id="dialog" title="Edit Blog Entry">
            <form id="edit_form">
                <fieldset>
                    <input type="hidden" name="id" id="edit_id_field" />

                    <div className="modal-header">
                        <h3 id="myModalLabel">Edit Blog Entry</h3>
                    </div>

                    <div className="modal-body">
                        <textarea name="content" cols="70" rows="5" id="edit_content_field" />
                        <input
                            type="text"
                            name="date"
                            value=""
                            id="edit_date_field"
                            className="date_field"
                            maxLength="20"
                        />
                        <span>
                            What I'm eating / drinking / playing; I'm thinking / loving /feeling; I'm listening
                            /watching /reading
                        </span>
                    </div>
                    <a href="#" id="edit_date_field_yesterday_link" className="previous_day_link">
                        Previous Day
                    </a>
                    <div className="modal-footer">
                        <input type="submit" name="" value="Submit Post!" id="dialog_submit" />
                        <button type="button" id="dialog_cancel">
                            Cancel
                        </button>

                        <button type="button" id="edit_delete_link">
                            Delete
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};

export default EntryDialog;
