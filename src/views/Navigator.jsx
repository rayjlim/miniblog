import { Link } from 'react-router-dom';

const Navigator = (props) => {
    // const prefix = '/smsblog/index.php/';
    // const prefix = '/projects/miniblog/';

    return (
        <div className="navigator btn-group" role="group" aria-label="...">
            <Link to="/text" className="btn btn-default">
                Lister
            </Link>
            <Link to="/oneDay" className="btn btn-default">
                OneDay
            </Link>
        </div>
    );
};
export default Navigator;
