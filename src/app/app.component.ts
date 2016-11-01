import { Component, Output } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'app works!';
	fileIsOver: boolean = false;
	exportFile: string;
	errorMessage: string;
  @Output() options = {
    readAs: 'Text'
  };

  public fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }
  public onFileDrop(file: string): void {
		var lines = file.split("\r\n");
		if (lines[0] !== '"Job","Clocked In","Clocked Out","Duration","Hourly Rate","Earnings","Comment","Tags","Breaks","Adjustments","TotalTimeAdjustment","TotalEarningsAdjustment"') {
			this.errorMessage = "Not a valid HoursTracker export";
			return;
		}
		lines = lines.splice(1);
		lines.forEach(line => {
			
		});
		this.exportFile = file;
  }
}
