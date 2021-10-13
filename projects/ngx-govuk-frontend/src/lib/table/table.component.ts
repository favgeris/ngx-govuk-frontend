import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';

import { GovukTableColumn, SortEvent } from './table.interface';

@Component({
  selector: 'govuk-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> {
  @Input() columns!: GovukTableColumn<T>[];
  @Input() data!: Pick<T, GovukTableColumn<T>['field']>[];
  @Input() caption?: string;
  @Output() readonly sort = new EventEmitter<SortEvent>();
  @ContentChild(TemplateRef) template?: TemplateRef<{
    column: GovukTableColumn<T>;
    row: Pick<T, GovukTableColumn<T>['field']>;
    index: number;
  }>;

  sortedField?: GovukTableColumn<T>['field'];
  sortedColumn?: GovukTableColumn<T>['header'];
  sortingDirection?: 'ascending' | 'descending';

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  getTypeof(value: any): string {
    return typeof value;
  }

  sortBy(columnField: GovukTableColumn<T>['field']): void {
    this.sortingDirection =
      this.sortedField === columnField && this.sortingDirection === 'ascending' ? 'descending' : 'ascending';
    this.sortedField = columnField;
    this.sortedColumn = this.columns.find((column) => column.field === columnField)!.header;

    this.changeDetectorRef.markForCheck();

    this.sort.emit({ column: this.sortedField, direction: this.sortingDirection });
  }
}
