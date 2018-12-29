import axios from "axios";
import store from "../reducers/store";
import * as types from "../actions/action-types";

function getEntrys(queryField, queryParam) {
  queryParam = queryParam || "";
  console.log("getEntrys" + queryParam);
  const url = `${BASE_URL}api/posts/?${queryField}=` + encodeURIComponent(queryParam)
  console.log("url: " + url);
  return axios.get(url)
    .then(response => {
      store.dispatch({
        type: types.GET_POSTS_SUCCESS,
        posts: response.data.entries
      });
      return response;
    })
    .catch(err => {
      console.error(err);
      alert(err);
    });
}

function sameDayEntrys(searchParam = "") {
  return axios
    .get(
      `${BASE_URL}/api/sameDayEntries/?day=` + encodeURIComponent(searchParam)
    )
    .then(response => {
      store.dispatch({
        type: types.GET_POSTS_SUCCESS,
        posts: response.data.entries
      });
      return response;
    })
    .catch(err => {
      console.error(err);
      alert(err);
    });
}

function createEntry(content, dateParam = null) {
  console.log("createEntry " + content);
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
  console.log("BASE_URL " + BASE_URL);
  axios
    .post(BASE_URL + "/api/posts/", prepContent)
    .then(response => {
      console.log(response);
      alert("Saved");
      store.dispatch({
        type: types.ADD_SUCCESS,
        post: response.data
      });
    })
    .catch(function(error) {
      console.log(error);
      alert(error);
    });
}

function updateEntry(entry) {
  let prepContent = JSON.stringify(entry);
  console.log("updateEntry " + entry);

  axios
    .put(`${BASE_URL}/api/posts/${entry.id}`, prepContent)
    .then(response => {
      console.log(response);
      alert("Updated");
      store.dispatch({
        type: types.UPDATE_SUCCESS,
        entry
      });
    })
    .catch(function(error) {
      console.log(error);
      alert(error);
    });
}

function deleteEntry(id) {
  console.log("deleteEntry " + id);
  axios
    .delete(`${BASE_URL}/api/posts/${id}`)
    .then(response => {
      console.log(response);
      alert("removed");
      store.dispatch({
        type: types.DELETE_SUCCESS,
        id
      });
    })
    .catch(function(error) {
      console.log(error);
      alert(error);
    });
}

function rotateImgLeft(fileName, filePath) {
  console.log("rotateLeft ");
  rotate(
    `${BASE_URL}/uploadRotate/?api=true&fileName=${fileName}&filePath=${filePath}&left=true`
  );
}

function rotateImgRight(fileName, filePath) {
  console.log("rotateRight");
  rotate(
    `${BASE_URL}/uploadRotate/?api=true&fileName=${fileName}&filePath=${filePath}`
  );
}

function rotate(URL) {
  axios
    .get(URL)
    .then(response => {
      console.log(response);
      store.dispatch({
        type: types.UPDATE_FILEVIEW,
        fileName: response.data.fileName,
        filePath: response.data.filePath
      });
    })
    .catch(function(error) {
      console.log(error);
      alert(error);
    });
}

function resizeImg(fileName, filePath) {
  console.log("resize");
  let URL = `${BASE_URL}/uploadResize/?api=true&fileName=${fileName}&filePath=${filePath}`;
  axios
    .get(URL)
    .then(response => {
      console.log(response);
      store.dispatch({
        type: types.UPDATE_FILEVIEW,
        fileName: response.data.fileName,
        filePath: response.data.filePath
      });
    })
    .catch(function(error) {
      console.log(error);
      alert(error);
    });
}

function renameImg(originalName, filePath, newFileName) {
  console.log("renameImg " + newFileName);
  let prepContent = JSON.stringify({
    fileName: originalName,
    filePath,
    newFileName,
    api: true
  });

  axios
    .post(`${BASE_URL}/uploadRename/`, prepContent)
    .then(response => {
      console.log(response);

      store.dispatch({
        type: types.UPDATE_FILEVIEW,
        fileName: response.data.fileName,
        filePath: response.data.filePath
      });
    })
    .catch(function(error) {
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
}
