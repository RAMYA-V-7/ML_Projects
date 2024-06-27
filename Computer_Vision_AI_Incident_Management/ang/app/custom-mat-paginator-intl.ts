import { MatPaginatorIntl } from '@angular/material/paginator';
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Incidents per page';
  override nextPageLabel = 'Next page';
  override previousPageLabel = 'Previous page';
  override firstPageLabel = 'First page';
  override lastPageLabel = 'Last page';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 of ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} of ${length}`;
  };
}
