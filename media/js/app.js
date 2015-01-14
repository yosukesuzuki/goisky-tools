(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BuildAppList, BuildForm, BuildFormList, BuildFormUpdate, SetPostData, appStoreOptions, appStores, blobStoreImageSchema, iOSAppSchema, key, schemas, value;

document.addEventListener("DOMContentLoaded", function(event) {
  var pathName;
  console.log("DOM fully loaded and parsed");
  pathName = location.pathname.split("/")[2];
  switch (pathName) {
    case "":
    case void 0:
      BuildAppList();
      break;
    case "form":
      BuildForm();
      window.onhashchange = BuildForm;
  }
});

BuildAppList = function() {
  var items, key, listVue, value;
  items = [];
  for (key in schemas) {
    value = schemas[key];
    items.push(value);
  }
  return listVue = new Vue({
    el: "#form-container",
    template: "#appList",
    data: {
      items: items
    }
  });
};

BuildForm = function() {
  var crudMethod, hashArr, keyName, modelName, schema;
  hashArr = location.hash.split("/");
  modelName = hashArr[1];
  crudMethod = hashArr[2];
  keyName = hashArr[3];
  schema = schemas[modelName];
  switch (crudMethod) {
    case "update":
      return BuildFormUpdate(schema, keyName);
    case "list":
      return BuildFormList(schema);
  }
};

SetPostData = function(items) {
  var returnObject, v, _i, _len;
  returnObject = {};
  for (_i = 0, _len = items.length; _i < _len; _i++) {
    v = items[_i];
    returnObject[v.fieldName] = v.fieldValue;
  }
  return returnObject;
};

BuildFormUpdate = function(schema, keyName) {
  var formVue;
  return formVue = new Vue({
    el: "#form-container",
    template: "#formTemplate",
    data: {
      formTitle: schema.formTitle,
      items: schema.schema
    },
    created: function() {
      var request;
      if (keyName) {
        request = window.superagent;
        return request.get(schema.apiEndpoint + "/" + keyName, function(res) {
          var data, v, _i, _len, _ref, _results;
          data = res.body;
          _ref = formVue.$data.items;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            v = _ref[_i];
            _results.push(v.fieldValue = data[v.fieldName]);
          }
          return _results;
        });
      }
    },
    methods: {
      cancel: function(e) {
        return location.hash = "/" + schema.modelName + "/list";
      },
      submitUpdate: function(e) {
        var request;
        e.preventDefault();
        this.$event.toElement.innerHTML = "..loading";
        this.$event.toElement.setAttribute("disabled", "disabled");
        request = window.superagent;
        return request.post(schema.apiEndpoint).send(SetPostData(this.$data.items)).set("Accept", "application/json").end(function(error, res) {
          var items;
          if (error == null) {
            items = res.body;
            console.log(items);
            location.hash = "/" + schema.modelName + "/list";
            return location.reload();
          }
        });
      }
    }
  });
};

BuildFormList = function(schema) {
  var listVue, request;
  listVue = new Vue({
    el: "#form-container",
    template: "#listTemplate",
    data: {
      formTitle: schema.formTitle,
      formDescription: schema.formDescription,
      modelName: schema.modelName,
      items: []
    },
    methods: {
      executeTask: function(e) {
        var request;
        request = window.superagent;
        return request.get(schema.taskEndpoint, function(res) {
          return console.log("done");
        });
      },
      deleteEntity: function(e) {
        var keyName, request;
        if (window.confirm('Delete this entity?')) {
          keyName = e.targetVM.$data.app_id;
          request = window.superagent;
          return request.del(schema.apiEndpoint + "/" + keyName, function(res) {
            var items;
            items = res.body;
            return listVue.$data.items.$remove(e.targetVM.$index);
          });
        }
      }
    }
  });
  request = window.superagent;
  request.get(schema.apiEndpoint, function(res) {
    var items;
    items = res.body;
    return listVue.$data.items = items.items;
  });
  if (document.querySelector("#imagetarget")) {
    return request.get("/admin/blobstoreimage/uploadurl", function(res) {
      var blobDropzone;
      blobDropzone = new Dropzone("div#imagetarget", {
        url: res.body.uploadurl,
        uploadMultiple: false
      });
      return blobDropzone.on("complete", function(file) {
        return request.get("/admin/blobstoreimage/handler", function(res) {
          return request.get(schema.apiEndpoint, function(res) {
            var items;
            items = res.body;
            return listVue.$data.items = items.items;
          });
        });
      });
    });
  }
};

Vue.filter("dateFormat", function(value) {
  var localTime;
  value = value.replace(/T/, " ");
  localTime = moment.utc(value.slice(0, 16)).toDate();
  localTime = moment(localTime).format("YYYY-MM-DD HH:mm (Z)");
  return localTime;
});

Vue.filter("dateFormatUTC", function(value) {
  value = value.replace(/T/, " ");
  return value.slice(0, 16);
});

appStores = {
  Argentina: 143505,
  Australia: 143460,
  Belgium: 143446,
  Brazil: 143503,
  Canada: 143455,
  Chile: 143483,
  China: 143465,
  Colombia: 143501,
  "Costa Rica": 143495,
  Croatia: 143494,
  "Czech Republic": 143489,
  Denmark: 143458,
  Deutschland: 143443,
  "El Salvador": 143506,
  Espana: 143454,
  Finland: 143447,
  France: 143442,
  Greece: 143448,
  Guatemala: 143504,
  "Hong Kong": 143463,
  Hungary: 143482,
  India: 143467,
  Indonesia: 143476,
  Ireland: 143449,
  Israel: 143491,
  Italia: 143450,
  Korea: 143466,
  Kuwait: 143493,
  Lebanon: 143497,
  Luxembourg: 143451,
  Malaysia: 143473,
  Mexico: 143468,
  Nederland: 143452,
  "New Zealand": 143461,
  Norway: 143457,
  Osterreich: 143445,
  Pakistan: 143477,
  Panama: 143485,
  Peru: 143507,
  Phillipines: 143474,
  Poland: 143478,
  Portugal: 143453,
  Qatar: 143498,
  Romania: 143487,
  Russia: 143469,
  "Saudi Arabia": 143479,
  "Schweiz/Suisse": 143459,
  Singapore: 143464,
  Slovakia: 143496,
  Slovenia: 143499,
  "South Africa": 143472,
  "Sri Lanka": 143486,
  Sweden: 143456,
  Taiwan: 143470,
  Thailand: 143475,
  Turkey: 143480,
  "United Arab Emirates": 143481,
  "United Kingdom": 143444,
  "United States": 143441,
  Venezuela: 143502,
  Vietnam: 143471,
  Japan: 143462,
  "Dominican Republic": 143508,
  Ecuador: 143509,
  Egypt: 143516,
  Estonia: 143518,
  Honduras: 143510,
  Jamaica: 143511,
  Kazakhstan: 143517,
  Latvia: 143519,
  Lithuania: 143520,
  Macau: 143515,
  Malta: 143521,
  Moldova: 143523,
  Nicaragua: 143512,
  Paraguay: 143513,
  Uruguay: 143514
};

appStoreOptions = [];

for (key in appStores) {
  value = appStores[key];
  appStoreOptions.push({
    text: key,
    value: value
  });
}

iOSAppSchema = [
  {
    fieldTitle: "Application ID",
    fieldName: "app_id",
    fieldType: "inputtext",
    fieldValue: ""
  }, {
    fieldTitle: "Title",
    fieldName: "title",
    fieldType: "inputtext",
    fieldValue: ""
  }, {
    fieldTitle: "Webhook URL",
    fieldName: "webhook_url",
    fieldType: "inputtext",
    fieldValue: ""
  }, {
    fieldTitle: "Icon URL",
    fieldName: "icon_url",
    fieldType: "inputtext",
    fieldValue: ""
  }, {
    fieldTitle: "Description",
    fieldName: "content",
    fieldType: "textarea",
    fieldValue: ""
  }, {
    fieldTitle: "Region",
    fieldName: "region",
    fieldType: "select",
    options: appStoreOptions,
    fieldValue: ""
  }
];

blobStoreImageSchema = [
  {
    fieldTitle: "Title",
    fieldName: "title",
    fieldType: "inputtext",
    fieldValue: ""
  }, {
    fieldTitle: "Note",
    fieldName: "note",
    fieldType: "inputtext",
    fieldValue: ""
  }, {
    fieldTitle: "Image URL",
    fieldName: "image_url",
    fieldType: "inputtext",
    fieldValue: ""
  }
];

schemas = {
  iosapp: {
    schema: iOSAppSchema,
    modelName: "iosapp",
    apiEndpoint: "/admin/api/v1/iosapp",
    taskEndpoint: "/admin/task/iosapp/getreviews",
    formTitle: "AppStore App settings",
    formDescription: "When a review is posted to AppStore, notification is send to your slack channel"
  },
  blobstoreimage: {
    schema: blobStoreImageSchema,
    modelName: "blobstoreimage",
    apiEndpoint: "/admin/api/v1/blobstoreimage",
    formTitle: "Blob Store Image Management",
    formDescription: "Upload Image to BlobStore and get resizable image by parameter"
  }
};



},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdXp1a2l5b3N1a2UvZGV2L3NsYWNrLXRvb2xzL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9zdXp1a2l5b3N1a2UvZGV2L3NsYWNrLXRvb2xzL3NyYy9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLHlKQUFBOztBQUFBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsU0FBQyxLQUFELEdBQUE7QUFDNUMsTUFBQSxRQUFBO0FBQUEsRUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLDZCQUFaLENBQUEsQ0FBQTtBQUFBLEVBQ0EsUUFBQSxHQUFXLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBbEIsQ0FBd0IsR0FBeEIsQ0FBNkIsQ0FBQSxDQUFBLENBRHhDLENBQUE7QUFFQSxVQUFPLFFBQVA7QUFBQSxTQUNPLEVBRFA7QUFBQSxTQUNVLE1BRFY7QUFFSSxNQUFBLFlBQUEsQ0FBQSxDQUFBLENBRko7QUFDVTtBQURWLFNBR08sTUFIUDtBQUlJLE1BQUEsU0FBQSxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsTUFBTSxDQUFDLFlBQVAsR0FBc0IsU0FEdEIsQ0FKSjtBQUFBLEdBSDRDO0FBQUEsQ0FBOUMsQ0FBQSxDQUFBOztBQUFBLFlBV0EsR0FBYyxTQUFBLEdBQUE7QUFDWixNQUFBLDBCQUFBO0FBQUEsRUFBQSxLQUFBLEdBQVEsRUFBUixDQUFBO0FBQ0EsT0FBQSxjQUFBO3lCQUFBO0FBQ0UsSUFBQSxLQUFLLENBQUMsSUFBTixDQUFXLEtBQVgsQ0FBQSxDQURGO0FBQUEsR0FEQTtTQUdBLE9BQUEsR0FBYyxJQUFBLEdBQUEsQ0FDWjtBQUFBLElBQUEsRUFBQSxFQUFJLGlCQUFKO0FBQUEsSUFDQSxRQUFBLEVBQVUsVUFEVjtBQUFBLElBRUEsSUFBQSxF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LElBSUEsU0FBQSxFQUFVLHVCQUpWO0FBQUEsSUFLQSxlQUFBLEVBQWdCLGlGQUxoQjtHQURGO0FBQUEsRUFPQSxjQUFBLEVBQ0U7QUFBQSxJQUFBLE1BQUEsRUFBTyxvQkFBUDtBQUFBLElBQ0EsU0FBQSxFQUFXLGdCQURYO0FBQUEsSUFFQSxXQUFBLEVBQWEsOEJBRmI7QUFBQSxJQUdBLFNBQUEsRUFBVSw2QkFIVjtBQUFBLElBSUEsZUFBQSxFQUFnQixnRUFKaEI7R0FSRjtDQXhRRixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgXCJET01Db250ZW50TG9hZGVkXCIsIChldmVudCkgLT5cbiAgY29uc29sZS5sb2cgXCJET00gZnVsbHkgbG9hZGVkIGFuZCBwYXJzZWRcIlxuICBwYXRoTmFtZSA9IGxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KFwiL1wiKVsyXVxuICBzd2l0Y2ggcGF0aE5hbWVcbiAgICB3aGVuIFwiXCIsdW5kZWZpbmVkXG4gICAgICBCdWlsZEFwcExpc3QoKVxuICAgIHdoZW4gXCJmb3JtXCJcbiAgICAgIEJ1aWxkRm9ybSgpXG4gICAgICB3aW5kb3cub25oYXNoY2hhbmdlID0gQnVpbGRGb3JtXG4gIHJldHVyblxuXG5CdWlsZEFwcExpc3QgPS0+XG4gIGl0ZW1zID0gW11cbiAgZm9yIGtleSx2YWx1ZSBvZiBzY2hlbWFzXG4gICAgaXRlbXMucHVzaCB2YWx1ZVxuICBsaXN0VnVlID0gbmV3IFZ1ZShcbiAgICBlbDogXCIjZm9ybS1jb250YWluZXJcIlxuICAgIHRlbXBsYXRlOiBcIiNhcHBMaXN0XCJcbiAgICBkYXRhOlxuICAgICAgaXRlbXM6IGl0ZW1zXG4gIClcblxuQnVpbGRGb3JtID0gLT5cbiAgaGFzaEFyciA9IGxvY2F0aW9uLmhhc2guc3BsaXQoXCIvXCIpXG4gIG1vZGVsTmFtZSA9IGhhc2hBcnJbMV1cbiAgY3J1ZE1ldGhvZCA9IGhhc2hBcnJbMl1cbiAga2V5TmFtZSA9IGhhc2hBcnJbM11cbiAgc2NoZW1hID0gc2NoZW1hc1ttb2RlbE5hbWVdXG4gIHN3aXRjaCBjcnVkTWV0aG9kXG4gICAgd2hlbiBcInVwZGF0ZVwiIHRoZW4gQnVpbGRGb3JtVXBkYXRlKHNjaGVtYSxrZXlOYW1lKVxuICAgIHdoZW4gXCJsaXN0XCIgdGhlbiBCdWlsZEZvcm1MaXN0KHNjaGVtYSlcblxuU2V0UG9zdERhdGEgPSAoaXRlbXMpIC0+XG4gIHJldHVybk9iamVjdCA9IHt9XG4gIGZvciB2IGluIGl0ZW1zXG4gICAgcmV0dXJuT2JqZWN0W3YuZmllbGROYW1lXSA9IHYuZmllbGRWYWx1ZVxuICByZXR1cm4gcmV0dXJuT2JqZWN0XG5cbkJ1aWxkRm9ybVVwZGF0ZSA9IChzY2hlbWEsa2V5TmFtZSkgLT5cbiAgZm9ybVZ1ZSA9IG5ldyBWdWUoXG4gICAgZWw6IFwiI2Zvcm0tY29udGFpbmVyXCJcbiAgICB0ZW1wbGF0ZTogXCIjZm9ybVRlbXBsYXRlXCJcbiAgICBkYXRhOlxuICAgICAgZm9ybVRpdGxlOiBzY2hlbWEuZm9ybVRpdGxlXG4gICAgICBpdGVtczogc2NoZW1hLnNjaGVtYVxuICAgIGNyZWF0ZWQ6ICgpIC0+XG4gICAgICBpZiBrZXlOYW1lXG4gICAgICAgIHJlcXVlc3QgPSB3aW5kb3cuc3VwZXJhZ2VudFxuICAgICAgICByZXF1ZXN0LmdldCBzY2hlbWEuYXBpRW5kcG9pbnQrXCIvXCIra2V5TmFtZSwgKHJlcykgLT5cbiAgICAgICAgICBkYXRhID0gcmVzLmJvZHlcbiAgICAgICAgICBmb3IgdiBpbiBmb3JtVnVlLiRkYXRhLml0ZW1zXG4gICAgICAgICAgICB2LmZpZWxkVmFsdWUgPSBkYXRhW3YuZmllbGROYW1lXVxuICAgIG1ldGhvZHM6XG4gICAgICBjYW5jZWw6IChlKSAtPlxuICAgICAgICBsb2NhdGlvbi5oYXNoID0gXCIvXCIrc2NoZW1hLm1vZGVsTmFtZStcIi9saXN0XCJcbiAgICAgIHN1Ym1pdFVwZGF0ZTogKGUpIC0+XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICB0aGlzLiRldmVudC50b0VsZW1lbnQuaW5uZXJIVE1MID0gXCIuLmxvYWRpbmdcIlxuICAgICAgICB0aGlzLiRldmVudC50b0VsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIixcImRpc2FibGVkXCIpXG4gICAgICAgIHJlcXVlc3QgPSB3aW5kb3cuc3VwZXJhZ2VudFxuICAgICAgICByZXF1ZXN0LnBvc3Qoc2NoZW1hLmFwaUVuZHBvaW50KVxuICAgICAgICAgIC5zZW5kKFNldFBvc3REYXRhKEAkZGF0YS5pdGVtcykpXG4gICAgICAgICAgLnNldChcIkFjY2VwdFwiLCBcImFwcGxpY2F0aW9uL2pzb25cIilcbiAgICAgICAgICAuZW5kIChlcnJvciwgcmVzKSAtPlxuICAgICAgICAgICAgdW5sZXNzIGVycm9yP1xuICAgICAgICAgICAgICBpdGVtcyA9IHJlcy5ib2R5XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nIGl0ZW1zXG4gICAgICAgICAgICAgIGxvY2F0aW9uLmhhc2ggPSBcIi9cIitzY2hlbWEubW9kZWxOYW1lK1wiL2xpc3RcIlxuICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKVxuICApXG5cbkJ1aWxkRm9ybUxpc3QgPSAoc2NoZW1hKSAtPlxuICBsaXN0VnVlID0gbmV3IFZ1ZShcbiAgICBlbDogXCIjZm9ybS1jb250YWluZXJcIlxuICAgIHRlbXBsYXRlOiBcIiNsaXN0VGVtcGxhdGVcIlxuICAgIGRhdGE6XG4gICAgICBmb3JtVGl0bGU6IHNjaGVtYS5mb3JtVGl0bGVcbiAgICAgIGZvcm1EZXNjcmlwdGlvbjogc2NoZW1hLmZvcm1EZXNjcmlwdGlvblxuICAgICAgbW9kZWxOYW1lOiBzY2hlbWEubW9kZWxOYW1lXG4gICAgICBpdGVtczogW11cbiAgICBtZXRob2RzOlxuICAgICAgZXhlY3V0ZVRhc2s6IChlKSAtPlxuICAgICAgICByZXF1ZXN0ID0gd2luZG93LnN1cGVyYWdlbnRcbiAgICAgICAgcmVxdWVzdC5nZXQgc2NoZW1hLnRhc2tFbmRwb2ludCwgKHJlcykgLT5cbiAgICAgICAgICBjb25zb2xlLmxvZyBcImRvbmVcIlxuICAgICAgICAgIFxuICAgICAgZGVsZXRlRW50aXR5OiAoZSkgLT5cbiAgICAgICAgaWYgd2luZG93LmNvbmZpcm0oJ0RlbGV0ZSB0aGlzIGVudGl0eT8nKVxuICAgICAgICAgIGtleU5hbWUgPSBlLnRhcmdldFZNLiRkYXRhLmFwcF9pZFxuICAgICAgICAgIHJlcXVlc3QgPSB3aW5kb3cuc3VwZXJhZ2VudFxuICAgICAgICAgIHJlcXVlc3QuZGVsIHNjaGVtYS5hcGlFbmRwb2ludCtcIi9cIitrZXlOYW1lLCAocmVzKSAtPlxuICAgICAgICAgICAgaXRlbXMgPSByZXMuYm9keVxuICAgICAgICAgICAgbGlzdFZ1ZS4kZGF0YS5pdGVtcy4kcmVtb3ZlKGUudGFyZ2V0Vk0uJGluZGV4KVxuICApXG4gIHJlcXVlc3QgPSB3aW5kb3cuc3VwZXJhZ2VudFxuICByZXF1ZXN0LmdldCBzY2hlbWEuYXBpRW5kcG9pbnQsIChyZXMpIC0+XG4gICAgaXRlbXMgPSByZXMuYm9keVxuICAgIGxpc3RWdWUuJGRhdGEuaXRlbXMgPSBpdGVtcy5pdGVtc1xuICBpZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2ltYWdldGFyZ2V0XCIpXG4gICAgcmVxdWVzdC5nZXQgXCIvYWRtaW4vYmxvYnN0b3JlaW1hZ2UvdXBsb2FkdXJsXCIsIChyZXMpIC0+XG4gICAgICBibG9iRHJvcHpvbmUgPSBuZXcgRHJvcHpvbmUoXCJkaXYjaW1hZ2V0YXJnZXRcIixcbiAgICAgICAgdXJsOiByZXMuYm9keS51cGxvYWR1cmxcbiAgICAgICAgdXBsb2FkTXVsdGlwbGU6IGZhbHNlXG4gICAgICApXG4gICAgICBibG9iRHJvcHpvbmUub24gXCJjb21wbGV0ZVwiLCAoZmlsZSkgLT5cbiAgICAgICAgcmVxdWVzdC5nZXQgXCIvYWRtaW4vYmxvYnN0b3JlaW1hZ2UvaGFuZGxlclwiLChyZXMpIC0+XG4gICAgICAgICAgcmVxdWVzdC5nZXQgc2NoZW1hLmFwaUVuZHBvaW50LCAocmVzKSAtPlxuICAgICAgICAgICAgaXRlbXMgPSByZXMuYm9keVxuICAgICAgICAgICAgbGlzdFZ1ZS4kZGF0YS5pdGVtcyA9IGl0ZW1zLml0ZW1zXG5cblZ1ZS5maWx0ZXIgXCJkYXRlRm9ybWF0XCIsICh2YWx1ZSkgLT5cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9ULywgXCIgXCIpXG4gIGxvY2FsVGltZSA9IG1vbWVudC51dGModmFsdWUuc2xpY2UoMCwgMTYpKS50b0RhdGUoKVxuICBsb2NhbFRpbWUgPSBtb21lbnQobG9jYWxUaW1lKS5mb3JtYXQoXCJZWVlZLU1NLUREIEhIOm1tIChaKVwiKVxuICBsb2NhbFRpbWVcblxuVnVlLmZpbHRlciBcImRhdGVGb3JtYXRVVENcIiwgKHZhbHVlKSAtPlxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1QvLCBcIiBcIilcbiAgdmFsdWUuc2xpY2UgMCwgMTZcblxuYXBwU3RvcmVzID1cbiAgQXJnZW50aW5hOiAxNDM1MDVcbiAgQXVzdHJhbGlhOiAxNDM0NjBcbiAgQmVsZ2l1bTogMTQzNDQ2XG4gIEJyYXppbDogMTQzNTAzXG4gIENhbmFkYTogMTQzNDU1XG4gIENoaWxlOiAxNDM0ODNcbiAgQ2hpbmE6IDE0MzQ2NVxuICBDb2xvbWJpYTogMTQzNTAxXG4gIFwiQ29zdGEgUmljYVwiOiAxNDM0OTVcbiAgQ3JvYXRpYTogMTQzNDk0XG4gIFwiQ3plY2ggUmVwdWJsaWNcIjogMTQzNDg5XG4gIERlbm1hcms6IDE0MzQ1OFxuICBEZXV0c2NobGFuZDogMTQzNDQzXG4gIFwiRWwgU2FsdmFkb3JcIjogMTQzNTA2XG4gIEVzcGFuYTogMTQzNDU0XG4gIEZpbmxhbmQ6IDE0MzQ0N1xuICBGcmFuY2U6IDE0MzQ0MlxuICBHcmVlY2U6IDE0MzQ0OFxuICBHdWF0ZW1hbGE6IDE0MzUwNFxuICBcIkhvbmcgS29uZ1wiOiAxNDM0NjNcbiAgSHVuZ2FyeTogMTQzNDgyXG4gIEluZGlhOiAxNDM0NjdcbiAgSW5kb25lc2lhOiAxNDM0NzZcbiAgSXJlbGFuZDogMTQzNDQ5XG4gIElzcmFlbDogMTQzNDkxXG4gIEl0YWxpYTogMTQzNDUwXG4gIEtvcmVhOiAxNDM0NjZcbiAgS3V3YWl0OiAxNDM0OTNcbiAgTGViYW5vbjogMTQzNDk3XG4gIEx1eGVtYm91cmc6IDE0MzQ1MVxuICBNYWxheXNpYTogMTQzNDczXG4gIE1leGljbzogMTQzNDY4XG4gIE5lZGVybGFuZDogMTQzNDUyXG4gIFwiTmV3IFplYWxhbmRcIjogMTQzNDYxXG4gIE5vcndheTogMTQzNDU3XG4gIE9zdGVycmVpY2g6IDE0MzQ0NVxuICBQYWtpc3RhbjogMTQzNDc3XG4gIFBhbmFtYTogMTQzNDg1XG4gIFBlcnU6IDE0MzUwN1xuICBQaGlsbGlwaW5lczogMTQzNDc0XG4gIFBvbGFuZDogMTQzNDc4XG4gIFBvcnR1Z2FsOiAxNDM0NTNcbiAgUWF0YXI6IDE0MzQ5OFxuICBSb21hbmlhOiAxNDM0ODdcbiAgUnVzc2lhOiAxNDM0NjlcbiAgXCJTYXVkaSBBcmFiaWFcIjogMTQzNDc5XG4gIFwiU2Nod2Vpei9TdWlzc2VcIjogMTQzNDU5XG4gIFNpbmdhcG9yZTogMTQzNDY0XG4gIFNsb3Zha2lhOiAxNDM0OTZcbiAgU2xvdmVuaWE6IDE0MzQ5OVxuICBcIlNvdXRoIEFmcmljYVwiOiAxNDM0NzJcbiAgXCJTcmkgTGFua2FcIjogMTQzNDg2XG4gIFN3ZWRlbjogMTQzNDU2XG4gIFRhaXdhbjogMTQzNDcwXG4gIFRoYWlsYW5kOiAxNDM0NzVcbiAgVHVya2V5OiAxNDM0ODBcbiAgXCJVbml0ZWQgQXJhYiBFbWlyYXRlc1wiOiAxNDM0ODFcbiAgXCJVbml0ZWQgS2luZ2RvbVwiOiAxNDM0NDRcbiAgXCJVbml0ZWQgU3RhdGVzXCI6IDE0MzQ0MVxuICBWZW5lenVlbGE6IDE0MzUwMlxuICBWaWV0bmFtOiAxNDM0NzFcbiAgSmFwYW46IDE0MzQ2MlxuICBcIkRvbWluaWNhbiBSZXB1YmxpY1wiOiAxNDM1MDhcbiAgRWN1YWRvcjogMTQzNTA5XG4gIEVneXB0OiAxNDM1MTZcbiAgRXN0b25pYTogMTQzNTE4XG4gIEhvbmR1cmFzOiAxNDM1MTBcbiAgSmFtYWljYTogMTQzNTExXG4gIEthemFraHN0YW46IDE0MzUxN1xuICBMYXR2aWE6IDE0MzUxOVxuICBMaXRodWFuaWE6IDE0MzUyMFxuICBNYWNhdTogMTQzNTE1XG4gIE1hbHRhOiAxNDM1MjFcbiAgTW9sZG92YTogMTQzNTIzXG4gIE5pY2FyYWd1YTogMTQzNTEyXG4gIFBhcmFndWF5OiAxNDM1MTNcbiAgVXJ1Z3VheTogMTQzNTE0XG5cbmFwcFN0b3JlT3B0aW9ucyA9IFtdXG5mb3Iga2V5LHZhbHVlIG9mIGFwcFN0b3Jlc1xuICBhcHBTdG9yZU9wdGlvbnMucHVzaCh7dGV4dDprZXksdmFsdWU6dmFsdWV9KVxuXG5pT1NBcHBTY2hlbWEgPSBbXG4gIHtcbiAgICBmaWVsZFRpdGxlOiBcIkFwcGxpY2F0aW9uIElEXCJcbiAgICBmaWVsZE5hbWU6XCJhcHBfaWRcIlxuICAgIGZpZWxkVHlwZTpcImlucHV0dGV4dFwiXG4gICAgZmllbGRWYWx1ZTpcIlwiXG4gIH1cbiAge1xuICAgIGZpZWxkVGl0bGU6IFwiVGl0bGVcIlxuICAgIGZpZWxkTmFtZTpcInRpdGxlXCJcbiAgICBmaWVsZFR5cGU6XCJpbnB1dHRleHRcIlxuICAgIGZpZWxkVmFsdWU6XCJcIlxuICB9XG4gIHtcbiAgICBmaWVsZFRpdGxlOiBcIldlYmhvb2sgVVJMXCJcbiAgICBmaWVsZE5hbWU6XCJ3ZWJob29rX3VybFwiXG4gICAgZmllbGRUeXBlOlwiaW5wdXR0ZXh0XCJcbiAgICBmaWVsZFZhbHVlOlwiXCJcbiAgfVxuICB7XG4gICAgZmllbGRUaXRsZTogXCJJY29uIFVSTFwiXG4gICAgZmllbGROYW1lOlwiaWNvbl91cmxcIlxuICAgIGZpZWxkVHlwZTpcImlucHV0dGV4dFwiXG4gICAgZmllbGRWYWx1ZTpcIlwiXG4gIH1cbiAge1xuICAgIGZpZWxkVGl0bGU6IFwiRGVzY3JpcHRpb25cIlxuICAgIGZpZWxkTmFtZTpcImNvbnRlbnRcIlxuICAgIGZpZWxkVHlwZTpcInRleHRhcmVhXCJcbiAgICBmaWVsZFZhbHVlOlwiXCJcbiAgfVxuICB7XG4gICAgZmllbGRUaXRsZTpcIlJlZ2lvblwiXG4gICAgZmllbGROYW1lOlwicmVnaW9uXCJcbiAgICBmaWVsZFR5cGU6XCJzZWxlY3RcIlxuICAgIG9wdGlvbnM6IGFwcFN0b3JlT3B0aW9uc1xuICAgIGZpZWxkVmFsdWU6XCJcIlxuICB9XG5dXG5cbmJsb2JTdG9yZUltYWdlU2NoZW1hID0gW1xuICB7XG4gICAgZmllbGRUaXRsZTogXCJUaXRsZVwiXG4gICAgZmllbGROYW1lOlwidGl0bGVcIlxuICAgIGZpZWxkVHlwZTpcImlucHV0dGV4dFwiXG4gICAgZmllbGRWYWx1ZTpcIlwiXG4gIH1cbiAge1xuICAgIGZpZWxkVGl0bGU6IFwiTm90ZVwiXG4gICAgZmllbGROYW1lOlwibm90ZVwiXG4gICAgZmllbGRUeXBlOlwiaW5wdXR0ZXh0XCJcbiAgICBmaWVsZFZhbHVlOlwiXCJcbiAgfVxuICB7XG4gICAgZmllbGRUaXRsZTogXCJJbWFnZSBVUkxcIlxuICAgIGZpZWxkTmFtZTpcImltYWdlX3VybFwiXG4gICAgZmllbGRUeXBlOlwiaW5wdXR0ZXh0XCJcbiAgICBmaWVsZFZhbHVlOlwiXCJcbiAgfVxuXVxuc2NoZW1hcyA9XG4gIGlvc2FwcDpcbiAgICBzY2hlbWE6aU9TQXBwU2NoZW1hXG4gICAgbW9kZWxOYW1lOiBcImlvc2FwcFwiXG4gICAgYXBpRW5kcG9pbnQ6IFwiL2FkbWluL2FwaS92MS9pb3NhcHBcIlxuICAgIHRhc2tFbmRwb2ludDogXCIvYWRtaW4vdGFzay9pb3NhcHAvZ2V0cmV2aWV3c1wiXG4gICAgZm9ybVRpdGxlOlwiQXBwU3RvcmUgQXBwIHNldHRpbmdzXCJcbiAgICBmb3JtRGVzY3JpcHRpb246XCJXaGVuIGEgcmV2aWV3IGlzIHBvc3RlZCB0byBBcHBTdG9yZSwgbm90aWZpY2F0aW9uIGlzIHNlbmQgdG8geW91ciBzbGFjayBjaGFubmVsXCJcbiAgYmxvYnN0b3JlaW1hZ2U6XG4gICAgc2NoZW1hOmJsb2JTdG9yZUltYWdlU2NoZW1hXG4gICAgbW9kZWxOYW1lOiBcImJsb2JzdG9yZWltYWdlXCJcbiAgICBhcGlFbmRwb2ludDogXCIvYWRtaW4vYXBpL3YxL2Jsb2JzdG9yZWltYWdlXCJcbiAgICBmb3JtVGl0bGU6XCJCbG9iIFN0b3JlIEltYWdlIE1hbmFnZW1lbnRcIlxuICAgIGZvcm1EZXNjcmlwdGlvbjpcIlVwbG9hZCBJbWFnZSB0byBCbG9iU3RvcmUgYW5kIGdldCByZXNpemFibGUgaW1hZ2UgYnkgcGFyYW1ldGVyXCJcbiJdfQ==
