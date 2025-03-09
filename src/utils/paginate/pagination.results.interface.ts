export interface PaginationResultInterface<PaginationEntity> {

  results: PaginationEntity[]
  total: number
  page: number
  size: number
  
}
