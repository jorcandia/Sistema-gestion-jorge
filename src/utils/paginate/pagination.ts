import { PaginationResultInterface } from 'src/utils/paginate/pagination.results.interface'

export class Pagination<PaginationEntity> {
  public results: PaginationEntity[]
  public total_pages: number
  public total_results: number
  public current_page: number
  public page_size: number

  constructor(paginationResults: PaginationResultInterface<PaginationEntity>) {
    this.results = paginationResults.results
    this.total_pages = Math.ceil(paginationResults.total / paginationResults.size)
    this.total_results = paginationResults.total
    this.current_page = +paginationResults.page
    this.page_size = +paginationResults.size
  }
}
