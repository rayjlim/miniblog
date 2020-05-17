/* eslint-disable no-alert, no-console, no-unused-vars */
import React, { useState, useEffect, Fragment } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import constants from '../constants';
import AddForm from '../components/AddForm.jsx';
import MediaList from '../components/MediaList.jsx';
import history from '../utils/history';

const Media = () => {
    const [ post, setPost ] = useState({
        date: moment().format('YYYY-MM-DD'),
        fileName: '',
        filePath: '',
        prepend: '',
        imgUrl: ''
    });

    const [ mediaBaseDir, setMediaBaseDir ] = useState('');

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
            imgUrl: `${constants.PROJECT_ROOT}uploads/${filePath}${fileName}?r=${random}`
        });
    }, []);

    function mediaSelect(filePath, fileName) {
        let random = Math.random();
        setPost({
            fileName,
            filePath,
            prepend: `![](../uploads/${filePath}${fileName})`,
            imgUrl: `${constants.PROJECT_ROOT}uploads/${filePath}${fileName}?r=${random}`
        });
    }

    // ?fileName=0FE2E672-995F-481C-8E9F-ABA02BED3DAB.jpeg&filePath=2019-04/
    // http://localhost/projects/miniblog3/uploads/2019-10/B5BB1508-0AC2-4E85-A63B-22F843EDA3E9.jpeg
    // let fileName = `0FE2E672-995F-481C-8E9F-ABA02BED3DAB.jpeg`;
    // let filePath = `2019-04/`;

    async function resize(e) {
        console.log('resize' + post.filePath + ':' + post.fileName);
        const result = await axios(
            `${constants.REST_ENDPOINT}uploadResize/?fileName=${post.fileName}&filePath=${post.filePath}`
        );
        console.log('result :>> ', result);
        let random = Math.random();
        setPost({
            ...post,
            imgUrl: `${constants.PROJECT_ROOT}uploads/${post.filePath}${post.fileName}?r=${random}`
        });
    }

    async function rotateLeft(e) {
        console.log('ro-left' + post.filePath + ':' + post.fileName);
        const result = await axios(
            `${constants.REST_ENDPOINT}uploadRotate/?left=true&fileName=${post.fileName}&filePath=${post.filePath}`
        );
        console.log('result :>> ', result);
        let random = Math.random();
        setPost({
            ...post,
            imgUrl: `${constants.PROJECT_ROOT}uploads/${post.filePath}${post.fileName}?r=${random}`
        });
    }
    async function rotateRight(e) {
        console.log('ro-right' + post.filePath + ':' + post.fileName);
        const result = await axios(
            `${constants.REST_ENDPOINT}uploadRotate/?&fileName=${post.fileName}&filePath=${post.filePath}`
        );
        console.log('result :>> ', result);
        let random = Math.random();
        setPost({
            ...post,
            imgUrl: `${constants.PROJECT_ROOT}uploads/${post.filePath}${post.fileName}?r=${random}`
        });
    }

    function handleAdd(e) {
        console.log(e);
        alert('Entry created');
        history.push(`/`);
    }

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

    return (
        <Fragment>
            <nav className="navbar navbar-expand-sm navbar-light bg-light">
                <RouterNavLink to="/">
                    <i className="fa fa-home" /> <span>Home</span>
                </RouterNavLink>
                <RouterNavLink to="/search">
                    <i className="fa fa-search" /> <span>Search</span>
                </RouterNavLink>
                <RouterNavLink to="/sameday">
                    {' '}
                    <i className="fa fa-calendar-check" /> <span>Same Day</span>
                </RouterNavLink>
                <RouterNavLink to="/calendar">
                    <i className="fa fa-calendar" /> <span>Calendar</span>
                </RouterNavLink>
                <a href="https://miniblog.lilplaytime.com/login.php">
                    <i className="fa fa-sign-in" /> <span>Login</span>
                </a>
            </nav>

            {post.fileName !== '' && (
                <Fragment>
                    <p className="lead">Prepare the image for use</p>
                    <div className="grid-3mw">
                        <button onClick={(e) => rotateLeft(e)}>Left</button>
                        <button onClick={(e) => resize(e)}>Resize</button>
                        <button onClick={(e) => rotateRight(e)}>Right</button>
                    </div>
                    {/* rename={this.rename} */}
                    <hr />
                    <section className="container">
                        {post.imgUrl}
                        <img src={post.imgUrl} alt="edit img" />
                    </section>
                    <hr />
                    <h5>Image is automatically prepended on submit</h5>
                    <AddForm date={post.date} content={post.prepend} onSuccess={(e) => handleAdd(e)} />
                </Fragment>
            )}

            <nav className="navbar navbar-expand-sm navbar-light bg-light">
                <RouterNavLink to={`/upload`} className="btn navbar-btn">
                    <i className="fa fa-file-upload" /> Upload Pix
                </RouterNavLink>
            </nav>

            <MediaList baseDir={mediaBaseDir} onMediaSelect={mediaSelect} />
        </Fragment>
    );
};

export default Media;


