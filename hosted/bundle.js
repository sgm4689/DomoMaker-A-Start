"use strict";

var token;

var handleDomo = function handleDomo(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoHeight").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer();
  });
  return false;
};

var DomoForm = function DomoForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "domoForm",
      onSubmit: handleDomo,
      name: "domoForm",
      action: "/maker",
      method: "POST",
      className: "domoForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "name"
    }, "Name: "), /*#__PURE__*/React.createElement("input", {
      id: "domoName",
      type: "text",
      name: "name",
      placeholder: "Domo Name"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "age"
    }, "Age: "), /*#__PURE__*/React.createElement("input", {
      id: "domoAge",
      type: "text",
      name: "age",
      placeholder: "Domo Age"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "height"
    }, "Height: "), /*#__PURE__*/React.createElement("input", {
      id: "domoHeight",
      type: "text",
      name: "height",
      placeholder: "Domo Height"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeDomoSubmit",
      type: "submit",
      value: "Make Domo"
    }))
  );
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "domoList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyDomo"
      }, "No Domos yet"))
    );
  }

  var domoNodes = props.domos.map(function (domo) {
    return (/*#__PURE__*/React.createElement("div", {
        key: domo._id,
        className: "domo",
        onClick: function onClick() {
          DeleteDomo(domo.name);
        }
      }, /*#__PURE__*/React.createElement("img", {
        src: "/assets/img/face.png",
        alt: "domo face",
        className: "domoFace"
      }), /*#__PURE__*/React.createElement("h3", {
        className: "domoName"
      }, " Name: ", domo.name, " "), /*#__PURE__*/React.createElement("h3", {
        className: "domoAge"
      }, " Age ", domo.age, " "), /*#__PURE__*/React.createElement("h3", {
        className: "domoHeight"
      }, " Height ", domo.height, " "), /*#__PURE__*/React.createElement("img", {
        src: "/assets/img/delete.png",
        className: "deleteButton"
      }))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "domoList"
    }, domoNodes)
  );
};

var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
      domos: data.domos
    }), document.querySelector("#domos"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoForm, {
    csrf: csrf
  }), document.querySelector("#makeDomo"));
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
    domos: []
  }), document.querySelector("#domos"));
  loadDomosFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    token = result.csrfToken;
    setup(token);
  });
};

var DeleteDomo = function DeleteDomo(domoName) {
  var bigString = "name=".concat(domoName, "&_csrf=").concat(token);
  sendAjax('POST', '/getCollection', bigString, function (result) {
    loadDomosFromServer();
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cashe: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
