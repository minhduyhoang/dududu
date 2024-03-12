import * as moment from "moment-timezone";
import { Between, LessThanOrEqual, Like, MoreThanOrEqual, Not } from "typeorm";

class ConditionQuery {
  public create(data: any = {}, keySearch: string = "name") {
    const conditions = {};

    conditions["status"] = Not("REMOVED");
    if (data.status) conditions["status"] = data.status;

    if (data.keySearch) {
      keySearch = data.keySearch;
    }

    if (data.keyword) {
      conditions[keySearch] = Like("%" + data.keyword + "%");
    }

    if (data.userId) {
      conditions["user"] = { id: data.userId };
    }

    const dateFilterField = data.dateFilterField
      ? data.dateFilterField
      : "createdAt";

    if (data.fromDate) {
      data.fromDate = moment(data.fromDate).format("YYYY-MM-DD");

      conditions[dateFilterField] = MoreThanOrEqual(
        new Date(data.fromDate + " 00:00:00"),
      );
    }

    if (data.toDate) {
      data.toDate = moment(data.toDate).format("YYYY-MM-DD");

      if (data.fromDate) {
        conditions[dateFilterField] = Between(
          new Date(data.fromDate + " 00:00:00"),
          new Date(data.toDate + " 23:59:59"),
        );
      } else {
        conditions[dateFilterField] = LessThanOrEqual(
          new Date(data.toDate + " 23:59:59"),
        );
      }
    }

    if (data.startTime) {
      conditions["startTime"] = MoreThanOrEqual(new Date(data.startTime));
    }

    if (data.endTime) {
      conditions["endTime"] = LessThanOrEqual(new Date(data.endTime));
    }

    console.log("conditions", conditions);

    return conditions;
  }

  public search(data: any = {}, conditions: any = {}) {
    const { keyword } = data;
    if (keyword && data.keySearch) {
      delete conditions["name"];
      delete conditions[data.keySearch];
      const keySearch = data.keySearch.split(",");
      conditions =
        keySearch.length &&
        keySearch.map((item) => {
          return { ...conditions, [item]: Like("%" + keyword + "%") };
        });
    }

    return conditions;
  }
}

export const Condition = new ConditionQuery();
