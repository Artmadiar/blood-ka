import { Knex } from "knex";
import { Location } from "@/types";

export class LocationRepository {
  constructor(private readonly knex: Knex) {}

  async getLocation(id: string): Promise<Location | null> {
    const location = await this.knex("locations").where({ id }).first();

    return location || null;
  }

  async getConnectedLocations(locationId: string): Promise<Location[]> {
    const location = await this.getLocation(locationId);
    if (!location || !location.connectedLocations.length) {
      return [];
    }

    const locations = await this.knex("locations").whereIn(
      "id",
      location.connectedLocations
    );

    return locations;
  }
}
