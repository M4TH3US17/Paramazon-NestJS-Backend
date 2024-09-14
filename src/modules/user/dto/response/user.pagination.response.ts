import { PartialType } from "@nestjs/mapped-types";
import { PaginationDefaultDTO } from "src/utils/pagination.data";

export class UserPaginationDTO extends PartialType(PaginationDefaultDTO) {
};