import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
  throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

const Xchire_sql = neon(Xchire_databaseUrl);

export async function POST(req: NextRequest) {
  try {
    const Xchire_data = await req.json();

    const {
      activitystatus,
      activityremarks,
      startdate,
      enddate,
      referenceid,
      tsm,
      manager,
      typeactivity,
      photo, // ✅ include photo
    } = Xchire_data;

    const Xchire_activityQuery = `
      INSERT INTO activity (
        activitystatus, activityremarks, startdate, enddate, referenceid, tsm, manager, photo, date_created
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila'
      ) RETURNING *;
    `;

    const Xchire_progressQuery = `
      INSERT INTO progress (
        activitystatus, activityremarks, startdate, enddate, referenceid, tsm, manager, typeactivity, photo, date_created
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila'
      ) RETURNING *;
    `;

    const activityValues = [activitystatus, activityremarks, startdate, enddate, referenceid, tsm, manager, photo];
    const progressValues = [...activityValues, typeactivity]; // Add typeactivity for progress

    const Xchire_activityResult = await Xchire_sql(Xchire_activityQuery, activityValues);
    const Xchire_progressResult = await Xchire_sql(Xchire_progressQuery, progressValues);

    return NextResponse.json(
      {
        success: true,
        activityData: Xchire_activityResult,
        progressData: Xchire_progressResult,
      },
      { status: 201 }
    );
  } catch (Xchire_error: any) {
    console.error("Error inserting data:", Xchire_error);
    return NextResponse.json(
      { success: false, Xchire_error: "Failed to submit data." },
      { status: 500 }
    );
  }
}
