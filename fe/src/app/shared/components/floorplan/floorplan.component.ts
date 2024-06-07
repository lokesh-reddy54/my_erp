import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataLayerService } from '../../services/data-layer.service';
import { Observable, combineLatest } from 'rxjs';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { startWith, debounceTime, switchMap, map } from 'rxjs/operators';
import { SharedAnimations } from '../../animations/shared-animations';
import { CommonService } from '../../services/common.service';

declare let $: any;
declare let SVG: any;

@Component({
  selector: 'app-floorplan',
  templateUrl: './floorplan.component.html',
  styleUrls: ['./floorplan.component.scss'],
  animations: [SharedAnimations]
})
export class FloorPlanComponent implements OnInit, AfterViewInit {

  floorLength = 100;
  floorBreadth = 70;
  canvasWidth = '100%';
  canvasHeight = '100%';
  workStations = 1;
  desks = 0;
  canvas: any;
  selectedShape: any;
  selectedElement: any;

  constructor(
    public commonService: CommonService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    var self = this;
    setTimeout(function() {
      self.canvas = new SVG('canvas').size('100%', '100%');
      self.initPlanner();
      self.registerEvents();
    }, 500);
  }

  initPlanner() {
    // console.log("SVG : ", SVG);
    // var ele = this.canvas.polygon().draw({ snapToGrid: 5 }).attr('stroke-width', 1).attr('fill', 'none');
    // ele.on('drawstart', function(e) {
    //   document.addEventListener('keydown', function(e) {
    //     if (e.keyCode == 13) {
    //       ele.draw('done');
    //       ele.attr({ fill: '#82A0DF' });
    //       ele.off('drawstart');
    //       ele.selectize(false, { deepSelect: true });
    //     }
    //   });
    // });
  }

  selectShape() {
    var self = this;
    setTimeout(function() {
      var element;
      if (self.selectedShape == 'Line') {
        element = self.canvas.line().draw({ snapToGrid: 5 }).attr('stroke-width', 3).attr('fill', '#fff');
      } else if (self.selectedShape == 'Box') {
        element = self.canvas.rect().draw({ snapToGrid: 5 }).attr('stroke-width', 1).attr('fill', '#fff');
      } else if (self.selectedShape == 'Circle') {
        element = self.canvas.circle().draw({ snapToGrid: 5 }).attr('stroke-width', 1).attr('fill', '#fff');
      } else if (self.selectedShape == 'Polygon') {
        element = self.canvas.polygon().draw({ snapToGrid: 5 }).attr('stroke-width', 1).attr('fill', '#fff');
      }
      if (element) {
        var drawStopFunction = function() {
          element.draw('done');
          element.attr({ fill: '#82A0DF' });
          element.off('drawstart');
          element.selectize(false, { deepSelect: true });
          document.removeEventListener('keydown', drawStartFunction);
          self.selectedShape = null;
        }
        var drawStartFunction = function(e) {
          if (e.keyCode == 13) {
            drawStopFunction();
          }
        }
        element.on('drawstart', function(e) {
          document.addEventListener('keydown', drawStartFunction);
        });
        element.on('drawstop', function() {
          drawStopFunction();
        });
        element.on('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          if (self.selectedElement) {
            self.deselectElement();
          }
          var tagName = $(this)[0]._event.target.tagName, id = $(this)[0]._event.target.id;
          console.log(tagName + " - " + id);
          if (tagName == 'polygon') {
            self.selectedElement = SVG.select(tagName + "#" + id).attr({ 'fill': '#82A0DF' });
            // self.selectedElement.selectize(true, { deepSelect: true }).resize();
          } else {
            self.selectedElement = SVG.select(tagName + "#" + id);
          }
          self.selectedElement.attr('fill', 'none').selectize().selectize({deepSelect: true}).resize();
          self.selectedElement.on('resizedone', function(e) {
            if (e.target.points) {
              console.log("resizedone :: point : " + e.target.points);
            } else {
              console.log("resizedone :: point : " + e.target.x.baseVal.value + "," + e.target.y.baseVal.value + "," + e.target.width.baseVal.value + "," + e.target.height.baseVal.value);
            }
          });
          self.selectedElement.draggable().on('dragend', function(e) {
            if (e.target.points) {
              console.log("dragend :: point : " + e.target.points);
            } else {
              console.log("dragend :: point : " + e.target.x.baseVal.value + "," + e.target.y.baseVal.value + "," + e.target.width.baseVal.value + "," + e.target.height.baseVal.value);
            }
          });
          self.selectedElement.addClass('selected-element');
        });
      }
    }, 500);
  }

  registerEvents() {
    var self = this;
    // $("#canvas svg rect").on('click', function(e) {
    $("#canvas svg").on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var tagName = $(this)[0].tagName, id = $(this)[0].id;
      console.log(tagName + " - " + id);
      try {
        if (self.selectedElement && tagName == 'svg') {
          self.deselectElement();
        }
      } catch (e) { }
    });
  }

  deselectElement() {
    var self = this;
    self.selectedElement.attr({ fill: '#82A0DF' });
    self.selectedElement.selectize(false, { deepSelect: true });
    // self.selectedElement.draggable(false);
    self.selectedElement.removeClass('selected-element')
    self.selectedElement = null;
  }

}
