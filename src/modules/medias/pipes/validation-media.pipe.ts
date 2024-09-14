import { PipeTransform, BadRequestException } from '@nestjs/common';
import { MediaPaginationDTO } from '../dto/response/media.pagination.response';

export class ValidateMediaPaginationPipe implements PipeTransform {

    transform(value: any): MediaPaginationDTO {
        const { page, size, sort = 'media_id', order = 'asc', search = '' } = value;

        const pageNumber = Number(page);
        const sizeNumber = Number(size);

        if (isNaN(pageNumber) || pageNumber < 0)
            throw new BadRequestException(`Page must be a number greater than 0. (page=${page})`);

        if (isNaN(sizeNumber) || sizeNumber <= 0)
            throw new BadRequestException(`Size must be a number greater than 0. (size=${size})`);

        if (typeof sort !== 'string') 
            throw new BadRequestException('Sort field is invalid');
        
        if (typeof order !== 'string' || !['asc', 'desc'].includes(order)) 
            throw new BadRequestException('Order must be "asc" or "desc"');

        if (typeof search !== 'string') 
            throw new BadRequestException('Search term must be a string');

        return {
            page: pageNumber,
            size: sizeNumber,
            sort: String(sort),
            order: String(order),
            search: String(search),
        };
    }

}