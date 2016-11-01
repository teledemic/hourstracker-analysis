import { Component, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'app works!';
	fileIsOver: boolean = false;
	exportFile: string;
	dayData: Map<string, datapoint> = new Map();
	weeks: week[] = [];
	maxHours: number;
	errorMessage: string;
  @Output() options = {
    readAs: 'Text'
  };

	public getColor(day: datapoint): string {
		if (day && day.hours) {
			return "rgba(255, 0, 0, " + (day.hours / this.maxHours) + ")";
		} else {
			return "white";
		}
	}

	public getWeekHours(week: week): number {
		let total = 0;
		if (week.sunday) total += week.sunday.hours;
		if (week.monday) total += week.monday.hours;
		if (week.tuesday) total += week.tuesday.hours;
		if (week.wednesday) total += week.wednesday.hours;
		if (week.thursday) total += week.thursday.hours;
		if (week.friday) total += week.friday.hours;
		if (week.saturday) total += week.saturday.hours;
		return total;
	}
	public getWeekEarned(week: week): number {
		let total = 0;
		if (week.sunday) total += week.sunday.earnings;
		if (week.monday) total += week.monday.earnings;
		if (week.tuesday) total += week.tuesday.earnings;
		if (week.wednesday) total += week.wednesday.earnings;
		if (week.thursday) total += week.thursday.earnings;
		if (week.friday) total += week.friday.earnings;
		if (week.saturday) total += week.saturday.earnings;
		return total;
	}

  public fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }
  public onFileDrop(file: string): void {
		var me = this;
		let lines = file.split("\r\n");
		if (lines[0] !== '"Job","Clocked In","Clocked Out","Duration","Hourly Rate","Earnings","Comment","Tags","Breaks","Adjustments","TotalTimeAdjustment","TotalEarningsAdjustment"') {
			this.errorMessage = "Not a valid HoursTracker export";
			return;
		}
		lines = lines.splice(1);
		let minDate = moment();
		let maxHours = 0;
		lines.forEach(line => {
			let fields = line.split(",").map(value => {
				return value.substr(1, value.length - 2);
			});
			if (fields.length === 12) {
				let date = moment(fields[1]);
				let hours = Number(fields[3]);
				let earnings = Number(fields[5]);
				let day = me.dayData.get(date.toISOString());
				if (!day) {
					me.dayData.set(date.toISOString(), { date: date, hours: 0, earnings: 0 });
					day = me.dayData.get(date.toISOString());
				}
				day.hours += hours;
				day.earnings += earnings;
				if (date < minDate) {
					minDate = date;
				}
				if (hours > maxHours) {
					maxHours = hours;
				}
			}
		});
		let weekIterator = moment(minDate).day(0);
		while (weekIterator < moment()) {
			let w = new week();
			w.sunday = me.dayData.get(weekIterator.toISOString());
			weekIterator.day(1);
			w.monday = me.dayData.get(weekIterator.toISOString());
			weekIterator.day(2);
			w.tuesday = me.dayData.get(weekIterator.toISOString());
			weekIterator.day(3);
			w.wednesday = me.dayData.get(weekIterator.toISOString());
			weekIterator.day(4);
			w.thursday = me.dayData.get(weekIterator.toISOString());
			weekIterator.day(5);
			w.friday = me.dayData.get(weekIterator.toISOString());
			weekIterator.day(6);
			w.saturday = me.dayData.get(weekIterator.toISOString());
			weekIterator.day(7);
			me.weeks.push(w);
		}
		console.log(me.dayData);
		console.log(minDate);
		me.maxHours = maxHours;
		
		this.exportFile = file;
  }
}

interface datapoint {
	date: moment.Moment;
	hours: number;
	earnings: number;
}
class week {
	sunday: datapoint;
	monday: datapoint;
	tuesday: datapoint;
	wednesday: datapoint;
	thursday: datapoint;
	friday: datapoint;
	saturday: datapoint;
}