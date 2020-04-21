/* eslint-disable no-alert, no-console, no-unused-vars */
import React, { useState, useEffect, Fragment } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import constants from '../constants';
import MediaActionsForm from '../components/MediaActionsForm.jsx';
import AddForm from '../components/AddForm.jsx';

// class UploadViewerController extends Component {
//     componentDidMount() {
//         let loc = window.location + ``;
//         let param = loc.substring(loc.indexOf('?'));
//         let urlParams = new URLSearchParams(param);
//         let fileName = urlParams.get('fileName');
//         let filePath = urlParams.get('filePath');
//         console.log(urlParams);

//         this.handleAdd = this.handleAdd.bind(this);
// this.rotateLeft = this.rotateLeft.bind(this);
// this.rotateRight = this.rotateRight.bind(this);
// this.resize = this.resize.bind(this);
// this.rename = this.rename.bind(this);
// }

// handleAdd(entry) {
//     let fileReference = ``;
//
//     EntryApi.createEntry(prepend + entry.content, entry.date);
// }

// rotateLeft(e) {
//     console.log('left');
//     EntryApi.rotateImgLeft(this.props.fileName, this.props.filePath);
// }
// rotateRight(e) {
//     console.log('right');
//     EntryApi.rotateImgRight(this.props.fileName, this.props.filePath);
// }
// resize(e) {
//     console.log('resize');
//     EntryApi.resizeImg(this.props.fileName, this.props.filePath);
// }

// rename(newName) {
//     console.log('rename');
//     console.log(newName);

//     let oldName = this.props.fileName;
//     console.log(oldName);
//     let splitVal = oldName.split('.');

//     let changedName = `${splitVal[0]}.jpg`;
//     console.log(newName);
//     EntryApi.renameImg(this.props.fileName, this.props.filePath, changedName);
// }

// }

const Media = () => {
	const [ post, setPost ] = useState({
		date: '',
		fileName: '',
		filePath: '',
		random: '',
		prepend: '',
		imgUrl: ''
	});

	useEffect(() => {
		console.log('Media: useEffect');
		let loc = window.location + '';
		let param = loc.substring(loc.indexOf('?'));
		console.log('param :', param);
		let urlParams = new URLSearchParams(param);
		console.log('urlParams :', urlParams);
		const fileName = urlParams.has('fileName') ? urlParams.get('fileName') : '';
		const filePath = urlParams.has('filePath') ? urlParams.get('filePath') : '';
		let random = Math.random();
		setPost({
			fileName,
			filePath,
			prepend: `![](../uploads/${filePath}${fileName})`,
			imgUrl: `${constants.PROJECT_ROOT}uploads/${filePath}${fileName}?${random}`
		});
	}, []);

	// ?fileName=0FE2E672-995F-481C-8E9F-ABA02BED3DAB.jpeg&filePath=2019-04/
	// http://localhost/projects/miniblog3/uploads/2019-10/B5BB1508-0AC2-4E85-A63B-22F843EDA3E9.jpeg
	// let fileName = `0FE2E672-995F-481C-8E9F-ABA02BED3DAB.jpeg`;
	// let filePath = `2019-04/`;

	return (
		<Fragment>
			<p className="lead">Prepare the image for use</p>
			<MediaActionsForm
			// fileName={this.props.fileName}
			// rotateLeft={this.rotateLeft}
			// rotateRight={this.rotateRight}
			// resize={this.resize}
			// rename={this.rename}
			/>
			<hr />
			{post.imgUrl}
			<img src={post.imgUrl} alt="edit img" />
			<hr />
			<h5>Image is automatically prepended on submit</h5>
			<AddForm date={''} content={post.prepend} onSuccess={(e) => console.log(e)} />
			<br />
			<br /> <br />
			<br /> <br />
			<br />
			<nav className="navbar navbar-expand-sm  fixed-bottom navbar-light bg-light">
				<RouterNavLink to="/" className="btn navbar-btn">
					Blog Page
				</RouterNavLink>
				<a href="http://www.lilplaytime.com/smsblog/index.php/uploadForm/" className="btn navbar-btn">
					Upload Pix
				</a>
			</nav>
		</Fragment>
	);
};

export default Media;

