import { Component, OnInit, ViewChild, Input, Output } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { PeriodicElement } from "../demo-grid/demo-grid.component";
import { EventEmitter } from "@angular/core";

@Component({
  selector: "app-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.scss"]
})
export class GridComponent implements OnInit {
  @Input("data") data: Observable<[]> = new Observable(val => {
    val.next([]);
  });

  // tslint:disable-next-line: no-output-rename
  @Output() removeItems: EventEmitter<any[]> = new EventEmitter();

  headers: any = [];
  elements: any[] = [];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  newDataSource = new MatTableDataSource<PeriodicElement>([]);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor() {}

  ngOnInit() {
    this.data.subscribe((value: any[]) => {
      if (value.length) {
        this.headers = ["select", ...Object.keys(value[0])];
      }
      this.elements = value;
      this.rePopulateData();
    });
  }

  removeSelectedItems() {
    this.selection.selected.forEach(x => {
      this.elements.splice(this.elements.indexOf(x), 1);
    });
    this.removeItems.emit.apply(this.removeItems, this.selection.selected);
    this.selection.clear();
    this.rePopulateData();
  }

  rePopulateData() {
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.elements);
    this.dataSource.paginator = this.paginator;
  }

  addNewItem() {
    console.log("add new item");
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${
      this.selection.isSelected(row) ? "deselect" : "select"
    } row ${row.position + 1}`;
  }

  toggleAddNewMode() {
    this.newDataSource = new MatTableDataSource<PeriodicElement>([]);
    this.dataSource = this.newDataSource;
  }
}
