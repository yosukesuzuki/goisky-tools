(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BuildForm, BuildFormList, BuildFormUpdate, appStoreOptions, appStores, iOSAppSchema, key, schemas, value;

document.addEventListener("DOMContentLoaded", function(event) {
  var pathName;
  console.log("DOM fully loaded and parsed");
  pathName = location.pathname.split("/")[2];
  switch (pathName) {
    case "form":
      BuildForm();
      window.onhashchange = BuildForm;
  }
});

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

BuildFormUpdate = function(schema, keyName) {
  var formVue, request;
  formVue = new Vue({
    el: "#form-container",
    template: "#formTemplate",
    data: {
      formTitle: schema.formTitle,
      items: schema.schema,
      methods: {
        submitUpdate: function(e) {
          var request;
          request = window.superagent;
          return request.post(schema.apiEndpoint).send(this.$data.items).set("Accept", "application/json").end(function(error, res) {
            var items;
            items = res.body;
            return console.log(items);
          });
        }
      }
    }
  });
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
};

BuildFormList = function(schema) {
  var listVue, request;
  listVue = new Vue({
    el: "#form-container",
    template: "#listTemplate",
    data: {
      formTitle: schema.formTitle,
      formDescription: schema.formDescription,
      items: []
    }
  });
  request = window.superagent;
  return request.get("/admin/api/v1/iosapp", function(res) {
    var items;
    items = res.body;
    return listVue.$data.items = items.items;
  });
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

schemas = {
  iosapp: {
    schema: iOSAppSchema,
    schemaId: "iosapp",
    apiEndpoint: "/admin/api/v1/iosapp",
    formTitle: "AppStore App settings",
    formDescription: "When a review is posted to AppStore, notification is send to your slack channel"
  }
};



},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdXp1a2l5b3N1a2UvZGV2L3NsYWNrLXRvb2xzL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9zdXp1a2l5b3N1a2UvZGV2L3NsYWNrLXRvb2xzL3NyYy9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLHdHQUFBOztBQUFBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsU0FBQyxLQUFELEdBQUE7QUFDNUMsTUFBQSxRQUFBO0FBQUEsRUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLDZCQUFaLENBQUEsQ0FBQTtBQUFBLEVBQ0EsUUFBQSxHQUFXLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBbEIsQ0FBd0IsR0FBeEIsQ0FBNkIsQ0FBQSxDQUFBLENBRHhDLENBQUE7QUFFQSxVQUFPLFFBQVA7QUFBQSxTQUNPLE1BRFA7QUFFSSxNQUFBLFNBQUEsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLE1BQU0sQ0FBQyxZQUFQLEdBQXFCLFNBRHJCLENBRko7QUFBQSxHQUg0QztBQUFBLENBQTlDLENBQUEsQ0FBQTs7QUFBQSxTQVVBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSwrQ0FBQTtBQUFBLEVBQUEsT0FBQSxHQUFVLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBZCxDQUFvQixHQUFwQixDQUFWLENBQUE7QUFBQSxFQUNBLFNBQUEsR0FBWSxPQUFRLENBQUEsQ0FBQSxDQURwQixDQUFBO0FBQUEsRUFFQSxVQUFBLEdBQWEsT0FBUSxDQUFBLENBQUEsQ0FGckIsQ0FBQTtBQUFBLEVBR0EsT0FBQSxHQUFVLE9BQVEsQ0FBQSxDQUFBLENBSGxCLENBQUE7QUFBQSxFQUlBLE1BQUEsR0FBUyxPQUFRLENBQUEsU0FBQSxDQUpqQixDQUFBO0FBS0EsVUFBTyxVQUFQO0FB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U0FBQSxFQUFVLFFBRlo7QUFBQSxJQUdFLFNBQUEsRUFBVSxXQUhaO0FBQUEsSUFJRSxVQUFBLEVBQVcsRUFKYjtHQURhLEVBT2I7QUFBQSxJQUNFLFVBQUEsRUFBWSxPQURkO0FBQUEsSUFFRSxTQUFBLEVBQVUsT0FGWjtBQUFBLElBR0UsU0FBQSxFQUFVLFdBSFo7QUFBQSxJQUlFLFVBQUEsRUFBVyxFQUpiO0dBUGEsRUFhYjtBQUFBLElBQ0UsVUFBQSxFQUFZLGFBRGQ7QUFBQSxJQUVFLFNBQUEsRUFBVSxhQUZaO0FBQUEsSUFHRSxTQUFBLEVBQVUsV0FIWjtBQUFBLElBSUUsVUFBQSxFQUFXLEVBSmI7R0FiYSxFQW1CYjtBQUFBLElBQ0UsVUFBQSxFQUFZLGFBRGQ7QUFBQSxJQUVFLFNBQUEsRUFBVSxTQUZaO0FBQUEsSUFHRSxTQUFBLEVBQVUsVUFIWjtBQUFBLElBSUUsVUFBQSxFQUFXLEVBSmI7R0FuQmEsRUF5QmI7QUFBQSxJQUNFLFVBQUEsRUFBVyxRQURiO0FBQUEsSUFFRSxTQUFBLEVBQVUsUUFGWjtBQUFBLElBR0UsU0FBQSxFQUFVLFFBSFo7QUFBQSxJQUlFLE9BQUEsRUFBUyxlQUpYO0FBQUEsSUFLRSxVQUFBLEVBQVcsRUFMYjtHQXpCYTtDQXpKZixDQUFBOztBQUFBLE9BMkxBLEdBQ0U7QUFBQSxFQUFBLE1BQUEsRUFDRTtBQUFBLElBQUEsTUFBQSxFQUFPLFlBQVA7QUFBQSxJQUNBLFFBQUEsRUFBVSxRQURWO0FBQUEsSUFFQSxXQUFBLEVBQWEsc0JBRmI7QUFBQSxJQUdBLFNBQUEsRUFBVSx1QkFIVjtBQUFBLElBSUEsZUFBQSxFQUFnQixpRkFKaEI7R0FERjtDQTVMRixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgXCJET01Db250ZW50TG9hZGVkXCIsIChldmVudCkgLT5cbiAgY29uc29sZS5sb2cgXCJET00gZnVsbHkgbG9hZGVkIGFuZCBwYXJzZWRcIlxuICBwYXRoTmFtZSA9IGxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KFwiL1wiKVsyXVxuICBzd2l0Y2ggcGF0aE5hbWVcbiAgICB3aGVuIFwiZm9ybVwiXG4gICAgICBCdWlsZEZvcm0oKVxuICAgICAgd2luZG93Lm9uaGFzaGNoYW5nZSA9QnVpbGRGb3JtXG4gIHJldHVyblxuXG5cbkJ1aWxkRm9ybSA9IC0+XG4gIGhhc2hBcnIgPSBsb2NhdGlvbi5oYXNoLnNwbGl0KFwiL1wiKVxuICBtb2RlbE5hbWUgPSBoYXNoQXJyWzFdXG4gIGNydWRNZXRob2QgPSBoYXNoQXJyWzJdXG4gIGtleU5hbWUgPSBoYXNoQXJyWzNdXG4gIHNjaGVtYSA9IHNjaGVtYXNbbW9kZWxOYW1lXVxuICBzd2l0Y2ggY3J1ZE1ldGhvZFxuICAgIHdoZW4gXCJ1cGRhdGVcIiB0aGVuIEJ1aWxkRm9ybVVwZGF0ZShzY2hlbWEsa2V5TmFtZSlcbiAgICB3aGVuIFwibGlzdFwiIHRoZW4gQnVpbGRGb3JtTGlzdChzY2hlbWEpXG5cbkJ1aWxkRm9ybVVwZGF0ZSA9IChzY2hlbWEsa2V5TmFtZSkgLT5cbiAgZm9ybVZ1ZSA9IG5ldyBWdWUoXG4gICAgZWw6IFwiI2Zvcm0tY29udGFpbmVyXCJcbiAgICB0ZW1wbGF0ZTogXCIjZm9ybVRlbXBsYXRlXCJcbiAgICBkYXRhOlxuICAgICAgZm9ybVRpdGxlOiBzY2hlbWEuZm9ybVRpdGxlXG4gICAgICBpdGVtczogc2NoZW1hLnNjaGVtYVxuICAgICAgbWV0aG9kczpcbiAgICAgICAgc3VibWl0VXBkYXRlOiAoZSkgLT5cbiAgICAgICAgICByZXF1ZXN0ID0gd2luZG93LnN1cGVyYWdlbnRcbiAgICAgICAgICByZXF1ZXN0LnBvc3Qoc2NoZW1hLmFwaUVuZHBvaW50KVxuICAgICAgICAgICAgLnNlbmQoQCRkYXRhLml0ZW1zKVxuICAgICAgICAgICAgLnNldChcIkFjY2VwdFwiLCBcImFwcGxpY2F0aW9uL2pzb25cIilcbiAgICAgICAgICAgIC5lbmQgKGVycm9yLCByZXMpIC0+XG4gICAgICAgICAgICAgIGl0ZW1zID0gcmVzLmJvZHlcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cgaXRlbXNcbiAgKVxuICBpZiBrZXlOYW1lXG4gICAgcmVxdWVzdCA9IHdpbmRvdy5zdXBlcmFnZW50XG4gICAgcmVxdWVzdC5nZXQgc2NoZW1hLmFwaUVuZHBvaW50K1wiL1wiK2tleU5hbWUsIChyZXMpIC0+XG4gICAgICBkYXRhID0gcmVzLmJvZHlcbiAgICAgIGZvciB2IGluIGZvcm1WdWUuJGRhdGEuaXRlbXNcbiAgICAgICAgdi5maWVsZFZhbHVlID0gZGF0YVt2LmZpZWxkTmFtZV1cblxuXG5CdWlsZEZvcm1MaXN0ID0gKHNjaGVtYSkgLT5cbiAgbGlzdFZ1ZSA9IG5ldyBWdWUoXG4gICAgZWw6IFwiI2Zvcm0tY29udGFpbmVyXCJcbiAgICB0ZW1wbGF0ZTogXCIjbGlzdFRlbXBsYXRlXCJcbiAgICBkYXRhOlxuICAgICAgZm9ybVRpdGxlOiBzY2hlbWEuZm9ybVRpdGxlXG4gICAgICBmb3JtRGVzY3JpcHRpb246IHNjaGVtYS5mb3JtRGVzY3JpcHRpb25cbiAgICAgIGl0ZW1zOiBbXVxuICApXG4gIHJlcXVlc3QgPSB3aW5kb3cuc3VwZXJhZ2VudFxuICByZXF1ZXN0LmdldCBcIi9hZG1pbi9hcGkvdjEvaW9zYXBwXCIsIChyZXMpIC0+XG4gICAgaXRlbXMgPSByZXMuYm9keVxuICAgIGxpc3RWdWUuJGRhdGEuaXRlbXMgPSBpdGVtcy5pdGVtc1xuXG5cblZ1ZS5maWx0ZXIgXCJkYXRlRm9ybWF0XCIsICh2YWx1ZSkgLT5cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9ULywgXCIgXCIpXG4gIGxvY2FsVGltZSA9IG1vbWVudC51dGModmFsdWUuc2xpY2UoMCwgMTYpKS50b0RhdGUoKVxuICBsb2NhbFRpbWUgPSBtb21lbnQobG9jYWxUaW1lKS5mb3JtYXQoXCJZWVlZLU1NLUREIEhIOm1tIChaKVwiKVxuICBsb2NhbFRpbWVcblxuVnVlLmZpbHRlciBcImRhdGVGb3JtYXRVVENcIiwgKHZhbHVlKSAtPlxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1QvLCBcIiBcIilcbiAgdmFsdWUuc2xpY2UgMCwgMTZcblxuYXBwU3RvcmVzID1cbiAgQXJnZW50aW5hOiAxNDM1MDVcbiAgQXVzdHJhbGlhOiAxNDM0NjBcbiAgQmVsZ2l1bTogMTQzNDQ2XG4gIEJyYXppbDogMTQzNTAzXG4gIENhbmFkYTogMTQzNDU1XG4gIENoaWxlOiAxNDM0ODNcbiAgQ2hpbmE6IDE0MzQ2NVxuICBDb2xvbWJpYTogMTQzNTAxXG4gIFwiQ29zdGEgUmljYVwiOiAxNDM0OTVcbiAgQ3JvYXRpYTogMTQzNDk0XG4gIFwiQ3plY2ggUmVwdWJsaWNcIjogMTQzNDg5XG4gIERlbm1hcms6IDE0MzQ1OFxuICBEZXV0c2NobGFuZDogMTQzNDQzXG4gIFwiRWwgU2FsdmFkb3JcIjogMTQzNTA2XG4gIEVzcGFuYTogMTQzNDU0XG4gIEZpbmxhbmQ6IDE0MzQ0N1xuICBGcmFuY2U6IDE0MzQ0MlxuICBHcmVlY2U6IDE0MzQ0OFxuICBHdWF0ZW1hbGE6IDE0MzUwNFxuICBcIkhvbmcgS29uZ1wiOiAxNDM0NjNcbiAgSHVuZ2FyeTogMTQzNDgyXG4gIEluZGlhOiAxNDM0NjdcbiAgSW5kb25lc2lhOiAxNDM0NzZcbiAgSXJlbGFuZDogMTQzNDQ5XG4gIElzcmFlbDogMTQzNDkxXG4gIEl0YWxpYTogMTQzNDUwXG4gIEtvcmVhOiAxNDM0NjZcbiAgS3V3YWl0OiAxNDM0OTNcbiAgTGViYW5vbjogMTQzNDk3XG4gIEx1eGVtYm91cmc6IDE0MzQ1MVxuICBNYWxheXNpYTogMTQzNDczXG4gIE1leGljbzogMTQzNDY4XG4gIE5lZGVybGFuZDogMTQzNDUyXG4gIFwiTmV3IFplYWxhbmRcIjogMTQzNDYxXG4gIE5vcndheTogMTQzNDU3XG4gIE9zdGVycmVpY2g6IDE0MzQ0NVxuICBQYWtpc3RhbjogMTQzNDc3XG4gIFBhbmFtYTogMTQzNDg1XG4gIFBlcnU6IDE0MzUwN1xuICBQaGlsbGlwaW5lczogMTQzNDc0XG4gIFBvbGFuZDogMTQzNDc4XG4gIFBvcnR1Z2FsOiAxNDM0NTNcbiAgUWF0YXI6IDE0MzQ5OFxuICBSb21hbmlhOiAxNDM0ODdcbiAgUnVzc2lhOiAxNDM0NjlcbiAgXCJTYXVkaSBBcmFiaWFcIjogMTQzNDc5XG4gIFwiU2Nod2Vpei9TdWlzc2VcIjogMTQzNDU5XG4gIFNpbmdhcG9yZTogMTQzNDY0XG4gIFNsb3Zha2lhOiAxNDM0OTZcbiAgU2xvdmVuaWE6IDE0MzQ5OVxuICBcIlNvdXRoIEFmcmljYVwiOiAxNDM0NzJcbiAgXCJTcmkgTGFua2FcIjogMTQzNDg2XG4gIFN3ZWRlbjogMTQzNDU2XG4gIFRhaXdhbjogMTQzNDcwXG4gIFRoYWlsYW5kOiAxNDM0NzVcbiAgVHVya2V5OiAxNDM0ODBcbiAgXCJVbml0ZWQgQXJhYiBFbWlyYXRlc1wiOiAxNDM0ODFcbiAgXCJVbml0ZWQgS2luZ2RvbVwiOiAxNDM0NDRcbiAgXCJVbml0ZWQgU3RhdGVzXCI6IDE0MzQ0MVxuICBWZW5lenVlbGE6IDE0MzUwMlxuICBWaWV0bmFtOiAxNDM0NzFcbiAgSmFwYW46IDE0MzQ2MlxuICBcIkRvbWluaWNhbiBSZXB1YmxpY1wiOiAxNDM1MDhcbiAgRWN1YWRvcjogMTQzNTA5XG4gIEVneXB0OiAxNDM1MTZcbiAgRXN0b25pYTogMTQzNTE4XG4gIEhvbmR1cmFzOiAxNDM1MTBcbiAgSmFtYWljYTogMTQzNTExXG4gIEthemFraHN0YW46IDE0MzUxN1xuICBMYXR2aWE6IDE0MzUxOVxuICBMaXRodWFuaWE6IDE0MzUyMFxuICBNYWNhdTogMTQzNTE1XG4gIE1hbHRhOiAxNDM1MjFcbiAgTW9sZG92YTogMTQzNTIzXG4gIE5pY2FyYWd1YTogMTQzNTEyXG4gIFBhcmFndWF5OiAxNDM1MTNcbiAgVXJ1Z3VheTogMTQzNTE0XG5cbmFwcFN0b3JlT3B0aW9ucyA9IFtdXG5mb3Iga2V5LHZhbHVlIG9mIGFwcFN0b3Jlc1xuICBhcHBTdG9yZU9wdGlvbnMucHVzaCh7dGV4dDprZXksdmFsdWU6dmFsdWV9KVxuXG5pT1NBcHBTY2hlbWEgPSBbXG4gIHtcbiAgICBmaWVsZFRpdGxlOiBcIkFwcGxpY2F0aW9uIElEXCJcbiAgICBmaWVsZE5hbWU6XCJhcHBfaWRcIlxuICAgIGZpZWxkVHlwZTpcImlucHV0dGV4dFwiXG4gICAgZmllbGRWYWx1ZTpcIlwiXG4gIH1cbiAge1xuICAgIGZpZWxkVGl0bGU6IFwiVGl0bGVcIlxuICAgIGZpZWxkTmFtZTpcInRpdGxlXCJcbiAgICBmaWVsZFR5cGU6XCJpbnB1dHRleHRcIlxuICAgIGZpZWxkVmFsdWU6XCJcIlxuICB9XG4gIHtcbiAgICBmaWVsZFRpdGxlOiBcIldlYmhvb2sgVVJMXCJcbiAgICBmaWVsZE5hbWU6XCJ3ZWJob29rX3VybFwiXG4gICAgZmllbGRUeXBlOlwiaW5wdXR0ZXh0XCJcbiAgICBmaWVsZFZhbHVlOlwiXCJcbiAgfVxuICB7XG4gICAgZmllbGRUaXRsZTogXCJEZXNjcmlwdGlvblwiXG4gICAgZmllbGROYW1lOlwiY29udGVudFwiXG4gICAgZmllbGRUeXBlOlwidGV4dGFyZWFcIlxuICAgIGZpZWxkVmFsdWU6XCJcIlxuICB9XG4gIHtcbiAgICBmaWVsZFRpdGxlOlwiUmVnaW9uXCJcbiAgICBmaWVsZE5hbWU6XCJyZWdpb25cIlxuICAgIGZpZWxkVHlwZTpcInNlbGVjdFwiXG4gICAgb3B0aW9uczogYXBwU3RvcmVPcHRpb25zXG4gICAgZmllbGRWYWx1ZTpcIlwiXG4gIH1cbl1cblxuc2NoZW1hcyA9XG4gIGlvc2FwcDpcbiAgICBzY2hlbWE6aU9TQXBwU2NoZW1hXG4gICAgc2NoZW1hSWQ6IFwiaW9zYXBwXCJcbiAgICBhcGlFbmRwb2ludDogXCIvYWRtaW4vYXBpL3YxL2lvc2FwcFwiXG4gICAgZm9ybVRpdGxlOlwiQXBwU3RvcmUgQXBwIHNldHRpbmdzXCJcbiAgICBmb3JtRGVzY3JpcHRpb246XCJXaGVuIGEgcmV2aWV3IGlzIHBvc3RlZCB0byBBcHBTdG9yZSwgbm90aWZpY2F0aW9uIGlzIHNlbmQgdG8geW91ciBzbGFjayBjaGFubmVsXCJcbiJdfQ==
