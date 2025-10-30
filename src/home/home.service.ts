import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class HomeService {
  async create(Model, HeaderDto) {
    try {
      await Model.findOneAndUpdate({}, { $set: { header: HeaderDto } }, { upsert: true, new: true })
      return { status: true, message: 'created', data: HeaderDto }
    }
    catch (err) {
      if (err.code === 11000) {
        throw new BadRequestException('aleady exist')
      }
      throw new InternalServerErrorException(err)
    }
  }
  async createFileUpload(Model, fileUrls: string[] | string | null, awsService, body) {
    let uploadedFiles: string[] = [];
    try {
      const imageUrl = Array.isArray(fileUrls) ? fileUrls[0] : fileUrls;
      if (imageUrl) uploadedFiles.push(imageUrl);
      const updateData = { ...body };
      const urls = Array.isArray(fileUrls) ? fileUrls : fileUrls ? [fileUrls] : [];
      const sectionList = ['herosection', 'aboutus', 'chooseus', 'corporates', 'getintouch', 'footer'] as const;
      const section = sectionList.find((key) => updateData[key]);
      if (!section) {
        throw new BadRequestException('No valid section found to update');
      }
      const existing = await Model.findOne({}, { [section]: 1 }).lean();
      const oldFiles = existing?.[section]?.files || [];
      const newFiles = urls.map((url) => ({ image: url }));
      updateData[section] = {
        ...existing?.[section],
        ...updateData[section],
        files: urls.length > 0 ? [...oldFiles, ...newFiles] : oldFiles,
      };

      await Model.findOneAndUpdate(
        {},
        { $set: updateData },
        { upsert: true, new: true }
      );

      return { status: true, message: 'Created successfully' };
    } catch (err) {
      if (uploadedFiles.length > 0) {
        await Promise.all(
          uploadedFiles.map((url) => awsService.deleteFile(url))
        );
      }

      throw new BadRequestException(err.message || err);
    }
  }
  async getCommonData(Model, query) {

      const sectionList = ['herosection', 'aboutus', 'chooseus', 'corporates', 'getintouch', 'footer'] as const;
      const section = query?.section
      if (!section) {
        throw new BadRequestException('No valid section found to get data');
      }
      if (!sectionList.includes(section)) {
        throw new BadRequestException(`Invalid section. Allowed sections: ${sectionList.join(', ')}`);
      }
      const data = await Model.find({}, { [section]: 1, _id: 0 }).lean()
      return { status: true, data: data } 
  }
  async DeleteHomeImages(Model,section, sid, fid,awsService) {
 
    if (!mongoose.isValidObjectId(sid) || !mongoose.isValidObjectId(fid)) {
      throw new BadRequestException('Invalid ID format');
    }
    const sectionList = [
      'herosection',
      'aboutus',
      'chooseus',
      'corporates',
      'getintouch',
      'footer',
    ];

    if (!sectionList.includes(section)) {
      throw new BadRequestException('Invalid section name');
   }
   const exist = await Model.findOne(
    {
      [`${section}._id`]: sid,
      [`${section}.files._id`]: fid
    },
    {
      [`${section}.files.$`]: 1,
      _id: 0
    }
  ).lean();
   if (!exist ) {
    throw new BadRequestException(`No data found for ${section}`);
  }
  const fileUrl = exist?.[section]?.files?.[0]?.image;
  if (fileUrl) {
    await awsService.deleteFile(fileUrl);
  }
  await Model.updateOne(
    { [`${section}._id`]: sid },
    { $pull: { [`${section}.files`]: { _id: fid } } }
  );

  return { status: true, message: 'File deleted successfully' };
  
  }
}
