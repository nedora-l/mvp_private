// User role enum

import { UserProfile } from "@/lib/services";
import { AppDepartment } from "./common";
import { AppTeam } from "../../app/teams/teams_data_types";
import { AppCity, AppCountry } from "../common";

export type AppEmployee = {
  id: string|number;
  user?: UserProfile | null;
  firstname: string| null;
  lastname: string| null;
  name?: string| null;
  title?: string| null;
  team?:  AppTeam | null;
  department?: AppDepartment | null;
  country?: string | AppCountry | null;
  city?: string | AppCity | null;
  location?: string | null;
  email: string;
  phone: string;
  avatar: string;
};



export type AppEmployeeSearchFilterDtro = {
  query?: string;
  team?: string;
  department?: string;
  location?: string;
};
  