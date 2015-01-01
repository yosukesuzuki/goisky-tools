(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var IOSApp;

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");
  IOSApp();
});

IOSApp = function() {
  var request;
  request = window.superagent;
  return request.get("/admin/api/v1/iosapp", function(res) {
    var items, listVue;
    items = res.body;
    return listVue = new Vue({
      el: "#content-list-table",
      data: {
        items: items.items
      }
    });
  });
};



},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdXp1a2l5b3N1a2UvZGV2L3NsYWNrLXRvb2xzL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9zdXp1a2l5b3N1a2UvZGV2L3NsYWNrLXRvb2xzL3NyYy9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLE1BQUE7O0FBQUEsUUFBUSxDQUFDLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxTQUFDLEtBQUQsR0FBQTtBQUM1QyxFQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksNkJBQVosQ0FBQSxDQUFBO0FBQUEsRUFDQSxNQUFBLENBQUEsQ0FEQSxDQUQ0QztBQUFBLENBQTlDLENBQUEsQ0FBQTs7QUFBQSxNQUtBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxPQUFBO0FBQUEsRUFBQSxPQUFBLEdBQVUsTUFBTSxDQUFDLFVBQWpCLENBQUE7U0FDQSxPQUFPLENBQUMsR0FBUixDQUFZLHNCQUFaLEVBQW9DLFNBQUMsR0FBRCxHQUFBO0FBQ2xDLFFBQUEsY0FBQTtBQUFBLElBQUEsS0FBQSxHQUFRLEdBQUcsQ0FBQyxJQUFaLENBQUE7V0FDQSxPQUFBLEdBQWMsSUFBQSxHQUFBLENBQ1o7QUFBQSxNQUFBLEVBQUEsRUFBSSxxQkFBSjtBQUFBLE1BQ0EsSUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sS0FBSyxDQUFDLEtBQWI7T0FGRjtLQURZLEVBRm9CO0VBQUEsQ0FBcEMsRUFGTztBQUFBLENBTFQsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyIFwiRE9NQ29udGVudExvYWRlZFwiLCAoZXZlbnQpIC0+XG4gIGNvbnNvbGUubG9nIFwiRE9NIGZ1bGx5IGxvYWRlZCBhbmQgcGFyc2VkXCJcbiAgSU9TQXBwKClcbiAgcmV0dXJuXG5cbklPU0FwcCA9IC0+XG4gIHJlcXVlc3QgPSB3aW5kb3cuc3VwZXJhZ2VudFxuICByZXF1ZXN0LmdldCBcIi9hZG1pbi9hcGkvdjEvaW9zYXBwXCIsIChyZXMpIC0+XG4gICAgaXRlbXMgPSByZXMuYm9keVxuICAgIGxpc3RWdWUgPSBuZXcgVnVlKFxuICAgICAgZWw6IFwiI2NvbnRlbnQtbGlzdC10YWJsZVwiXG4gICAgICBkYXRhOlxuICAgICAgICBpdGVtczogaXRlbXMuaXRlbXNcbiAgICApXG4iXX0=
