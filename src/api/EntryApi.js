/* eslint-disable no-alert, no-console */
/* eslint indent: 0 */
import axios from 'axios';
import store from '../reducers/store';
import * as types from '../actions/action-types';
const BASEURL = BASE_URL; // eslint-disable-line no-undef

function getEntrys(queryField, queryParam = '') {
    // eslint-disable-line

    console.log(`getEntrys: ${queryParam}`);
    const url = `${BASEURL}api/posts/?${queryField}=${encodeURIComponent(queryParam)}`;
    console.log('url: ' + url);

    return axios
        .get(url)
        .then((response) => {
            store.dispatch({
                type: types.GET_POSTS_SUCCESS,
                posts: response.data.entries
            });
            return response;
        })
        .catch((err) => {
            console.error(err);
            alert(err);
        });
}

function sameDayEntrys(searchParam = '') {
    return axios
        .get(`${BASEURL}/api/sameDayEntries/?day=${encodeURIComponent(searchParam)}`)
        .then((response) => {
            store.dispatch({
                type: types.GET_POSTS_SUCCESS,
                posts: response.data.entries
            });
            return response;
        })
        .catch((err) => {
            console.error(err);
            alert(err);
        });
}

function createEntry(content, dateParam = null) {
    console.log('createEntry ' + content);
    let prepContent =
        dateParam === null
            ? {
                    content: content
                }
            : {
                    content: content,
                    date: dateParam
                };
    prepContent = JSON.stringify(prepContent);
    console.log('BASEURL ' + BASEURL);
    axios
        .post(BASEURL + '/api/posts/', prepContent)
        .then((response) => {
            console.log(response);
            $('.toast').toast('dispose');
            $('.toast-body').html('Saved');
            $('.toast').toast({ delay: 4000 });
            $('.toast').toast('show');
            store.dispatch({
                type: types.ADD_SUCCESS,
                post: response.data
            });
        })
        .catch((error) => {
            console.log(error);
            alert(error);
        });
}

function updateEntry(entry) {
    let prepContent = JSON.stringify(entry);
    console.log('updateEntry ' + entry);

    axios
        .put(`${BASEURL}/api/posts/${entry.id}`, prepContent)
        .then((response) => {
            console.log(response);
            $('.toast').toast('dispose');
            $('.toast-body').html('Updated The Entry');
            $('.toast').toast({ delay: 4000 });
            $('.toast').toast('show');
            store.dispatch({
                type: types.UPDATE_SUCCESS,
                entry
            });
        })
        .catch((error) => {
            console.log(error);
            alert(error);
        });
}

function deleteEntry(id) {
    console.log('deleteEntry ' + id);
    axios
        .delete(`${BASEURL}/api/posts/${id}`)
        .then((response) => {
            console.log(response);
            $('.toast').toast('dispose');
            $('.toast-body').html('Removed Entry');
            $('.toast').toast({ delay: 4000 });
            $('.toast').toast('show');
            store.dispatch({
                type: types.DELETE_SUCCESS,
                id
            });
        })
        .catch((error) => {
            console.log(error);
            alert(error);
        });
}

function rotate(URL) {
    axios
        .get(URL)
        .then((response) => {
            console.log(response);
            store.dispatch({
                type: types.UPDATE_FILEVIEW,
                fileName: response.data.fileName,
                filePath: response.data.filePath
            });
        })
        .catch((error) => {
            console.log(error);
            alert(error);
        });
}
function rotateImgLeft(fileName, filePath) {
    console.log('rotateLeft ');
    rotate(`${BASEURL}/uploadRotate/?api=true&fileName=${fileName}&filePath=${filePath}&left=true`);
}

function rotateImgRight(fileName, filePath) {
    console.log('rotateRight');
    rotate(`${BASEURL}/uploadRotate/?api=true&fileName=${fileName}&filePath=${filePath}`);
}

function resizeImg(fileName, filePath) {
    console.log('resize');
    let URL = `${BASEURL}/uploadResize/?api=true&fileName=${fileName}&filePath=${filePath}`;
    axios
        .get(URL)
        .then((response) => {
            console.log(response);
            store.dispatch({
                type: types.UPDATE_FILEVIEW,
                fileName: response.data.fileName,
                filePath: response.data.filePath
            });
        })
        .catch((error) => {
            console.log(error);
            alert(error);
        });
}

function renameImg(originalName, filePath, newFileName) {
    console.log('renameImg ' + newFileName);
    let prepContent = JSON.stringify({
        fileName: originalName,
        filePath,
        newFileName,
        api: true
    });

    axios
        .post(`${BASEURL}/uploadRename/`, prepContent)
        .then((response) => {
            console.log(response);

            store.dispatch({
                type: types.UPDATE_FILEVIEW,
                fileName: response.data.fileName,
                filePath: response.data.filePath
            });
        })
        .catch((error) => {
            console.log(error);
            alert(error);
        });
}

function clearForm() {
    store.dispatch({
        type: types.CLEAR_ADDEDIT
    });
}

function showForm() {
    store.dispatch({
        type: types.SHOW_FORM
    });
}

export default {
    getEntrys,
    createEntry,
    updateEntry,
    deleteEntry,
    sameDayEntrys,
    clearForm,
    showForm,
    rotateImgLeft,
    rotateImgRight,
    resizeImg,
    renameImg
};
