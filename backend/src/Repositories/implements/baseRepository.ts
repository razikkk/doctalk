import {  Document, Model } from "mongoose";
import { IBaseRepository } from "../interface/IBaseRepository";

export class BaseRepository<T extends Document> implements IBaseRepository<T>{
    protected model:Model<T>

    constructor(model:Model<T>){
        this.model = model
    }

    async create(data: Partial<T>): Promise<T> {
        const newItem = new this.model(data)
                return await newItem.save()
       
    }

    async findById(id: string): Promise<T | null> {
        return await this.model.findById(id).exec() // exec to properly handle mongoose queries
    }

    async findAll(): Promise<T[]> {
        return await this.model.find().exec()
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
      return await this.model.findByIdAndUpdate(id,data,{new:true}).exec()  
    }

    async delete(id: string): Promise<T | null> {
        return await this.model.findByIdAndDelete(id)
    }
}