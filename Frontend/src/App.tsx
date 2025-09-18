import { useState, useEffect } from "react";
import { supabase } from "./utils/supabase";

function Page() {
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    const getProfiles = async () => {
      const { data, error } = await supabase.from("cv_profiles").select("*");

      if (error) {
        console.error("Error fetching profiles:", error);
      } else {
        setProfiles(data || []);
      }
    };

    getProfiles();
  }, []);

  return (
    <div>
      <h2>Profiles</h2>
      <ul>
        {profiles.map((profile) => (
          <li key={profile.id}>{profile.full_name ?? profile.id}</li>
        ))}
      </ul>
    </div>
  );
}

export default Page;
