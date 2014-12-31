(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var IOSApp;

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");
  IOSApp();
});

IOSApp = function() {
  var xhr;
  xhr = new XMLHttpRequest();
  xhr.open("GET", "/admin/api/v1/iosapp", true);
  xhr.onload = function(e) {
    var items, listVue;
    items = JSON.parse(xhr.responseText);
    console.log(items);
    listVue = new Vue({
      el: "#content-list-table",
      data: {
        items: items.items
      }
    });
  };
  return xhr.send();
};



},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdXp1a2l5b3N1a2UvZGV2L3NsYWNrLXRvb2xzL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9zdXp1a2l5b3N1a2UvZGV2L3NsYWNrLXRvb2xzL3NyYy9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLE1BQUE7O0FBQUEsUUFBUSxDQUFDLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxTQUFDLEtBQUQsR0FBQTtBQUM1QyxFQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksNkJBQVosQ0FBQSxDQUFBO0FBQUEsRUFDQSxNQUFBLENBQUEsQ0FEQSxDQUQ0QztBQUFBLENBQTlDLENBQUEsQ0FBQTs7QUFBQSxNQUtBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxHQUFBO0FBQUEsRUFBQSxHQUFBLEdBQVUsSUFBQSxjQUFBLENBQUEsQ0FBVixDQUFBO0FBQUEsRUFDQSxHQUFHLENBQUMsSUFBSixDQUFTLEtBQVQsRUFBZ0Isc0JBQWhCLEVBQXdDLElBQXhDLENBREEsQ0FBQTtBQUFBLEVBRUEsR0FBRyxDQUFDLE1BQUosR0FBYSxTQUFDLENBQUQsR0FBQTtBQUVYLFFBQUEsY0FBQTtBQUFBLElBQUEsS0FBQSxHQUFRLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBRyxDQUFDLFlBQWYsQ0FBUixDQUFBO0FBQUEsSUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLEtBQVosQ0FEQSxDQUFBO0FBQUEsSUFFQSxPQUFBLEdBQWMsSUFBQSxHQUFBLENBQ1o7QUFBQSxNQUFBLEVBQUEsRUFBSSxxQkFBSjtBQUFBLE1BQ0EsSUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sS0FBSyxDQUFDLEtBQWI7T0FGRjtLQURZLENBRmQsQ0FGVztFQUFBLENBRmIsQ0FBQTtTQWFBLEdBQUcsQ0FBQyxJQUFKLENBQUEsRUFkTztBQUFBLENBTFQsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyIFwiRE9NQ29udGVudExvYWRlZFwiLCAoZXZlbnQpIC0+XG4gIGNvbnNvbGUubG9nIFwiRE9NIGZ1bGx5IGxvYWRlZCBhbmQgcGFyc2VkXCJcbiAgSU9TQXBwKClcbiAgcmV0dXJuXG5cbklPU0FwcCA9IC0+XG4gIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gIHhoci5vcGVuIFwiR0VUXCIsIFwiL2FkbWluL2FwaS92MS9pb3NhcHBcIiwgdHJ1ZVxuICB4aHIub25sb2FkID0gKGUpIC0+XG4gICAgIyBjb25zb2xlLmxvZyB4aHIucmVzcG9uc2VUZXh0ICBpZiBAc3RhdHVzIGlzIDIwMFxuICAgIGl0ZW1zID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KVxuICAgIGNvbnNvbGUubG9nIGl0ZW1zXG4gICAgbGlzdFZ1ZSA9IG5ldyBWdWUoXG4gICAgICBlbDogXCIjY29udGVudC1saXN0LXRhYmxlXCJcbiAgICAgIGRhdGE6XG4gICAgICAgIGl0ZW1zOiBpdGVtcy5pdGVtc1xuICAgIClcbiAgICByZXR1cm5cblxuICB4aHIuc2VuZCgpXG4iXX0=
