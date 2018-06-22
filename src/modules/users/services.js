import joi from 'joi';
import { ObjectId } from 'mongodb';
import clients from '../../clients';
import model, { modelForUpdate } from './models';
import errors from '../../enums/errors';
import md5 from 'md5';

class UsersServices {
  constructor(collectionName) {
    this.COLLECTION_NAME = collectionName;
  }

  createOne(data) {
    data.password = md5(data.password);
    return joi.validate(data, model).then(validatedData => clients.mongodb()
      .then(db => db.collection(this.COLLECTION_NAME).insertOne(validatedData))
      .then(response => response.ops[0]));
  }

  find(first = 20, offset = 0, term) {
    return clients.mongodb()
      .then((db) => {
        return db
          .collection(this.COLLECTION_NAME)
          .find(term ? { $text: { $search: term } } : null)
          .skip(offset)
          .limit(first)
          .toArray();
      });
  }

  findOne(userEmail) {
    return joi.validate(userEmail, joi.string().email().required())
      .then(() => clients.mongodb())
      .then(db => db.collection(this.COLLECTION_NAME).findOne({email: userEmail }))
      .then((list) => {
        if (!list) throw errors.notFound();
        delete list.password;
        return list;
      });
  }

  deleteOne(userEmail) {
    return joi.validate(userEmail, joi.string().email().required())
      .then(() => clients.mongodb())
      .then(db => db.collection(this.COLLECTION_NAME).deleteOne({email: userEmail }))
      .then((response) => {
        if (response.deletedCount === 0) throw errors.notFound();

        return response;
      });
  }

  updateOne(userEmail, data) {
    console.log(data);
    data.password = md5(data.password);
    return joi.validate(userEmail, joi.string().required())
      .then(() => joi.validate(data, modelForUpdate))
      .then((validatedData) => {
        return clients.mongodb()
          .then(db => db
            .collection(this.COLLECTION_NAME)
            .updateOne(
              { email: userEmail },
              { $set: validatedData },
            ));
      })
      .then((response) => {
        if (response.matchedCount === 0) throw errors.notFound();

        return response;
      })
      .then(() => this.findOne(userEmail));
  }

}

export default new UsersServices('users');
