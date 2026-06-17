import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { House, MapPin } from 'lucide-react';

function Substations() {

  const [addSubstationModal, setAddSubstationModal] = useState(false);
  const [substations, setSubstations] = useState([]);

  const [form, setForm] = useState({
    substationId: "",
    name: "",
    latitude: "",
    longitude: "",
    address: ""
  });

  const [search, setSearch] = useState("");
  const [markerPos, setMarkerPos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shouldFly, setShouldFly] = useState(false);

  useEffect(() => {
    const fetchSubstations = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/substation/get`, { withCredentials: true });
        // console.log(res.data);
        setSubstations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubstations();

  }, []);

  // add substation
  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/substation/add`, form, { withCredentials: true });
      alert(res.data.message);
      setAddSubstationModal(false);
      setForm({
        substationId: "",
        name: "",
        latitude: "",
        longitude: "",
        address: ""
      });
      setMarkerPos(null);
    } catch (err) {
      console.error(err);
    }
  };

  //  Fly ONLY when needed
  function FlyToLocation({ position, shouldFly, setShouldFly }) {
    const map = useMap();

    useEffect(() => {
      if (position && shouldFly) {
        map.flyTo(position, 14, { duration: 1.5 });
        setShouldFly(false);
      }
    }, [position, shouldFly]);

    return null;
  }

  //  Fix modal rendering bug
  function FixMapSize() {
    const map = useMap();

    useEffect(() => {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }, [map]);

    return null;
  }

  //  Click to place marker
  function LocationPicker({ setForm, setMarkerPos }) {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;

        setMarkerPos([lat, lng]);

        setForm(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng
        }));
      }
    });
    return null;
  }

  //  Current location
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

        const data = await res.json();

        setMarkerPos([lat, lng]);
        setShouldFly(true);

        setForm(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          address: data.display_name || ""
        }));

        setSearch(data.display_name || "");

      } catch (err) {
        console.error("Failed to fetch address:", err);

        setForm(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng
        }));
      }
    });
  };

  //  Search with loading + error handling
  const handleSearch = async () => {
    if (!search) return;

    try {
      setLoading(true);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${search}`
      );
      const data = await res.json();

      if (data.length === 0) {
        alert("Location not found");
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      setMarkerPos([lat, lon]);
      setShouldFly(true);

      setForm(prev => ({
        ...prev,
        latitude: lat,
        longitude: lon,
        address: data[0].display_name
      }));

      setSearch(data[0].display_name);

    } catch (err) {
      alert("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-4 space-y-6'>

      <button
        onClick={() => setAddSubstationModal(true)}
        className="text-white  hover:bg-[#5B21B6] cursor-pointer text-sm rounded-2xl py-2 px-5 bg-[#7C3AED]  transition"
      >
        Add Substation
      </button>

      <div className="bg-[#0D1422] p-4 rounded-xl border border-[#1A2B3C] w-[900px]">
        <table className="w-full text-sm">
          <thead className="text-[#4E6680] border-b border-[#1A2B3C]">
            <tr>
              <th className="  py-2">ID</th>
              <th className="">Substation Id</th>
              <th className=" ">Name</th>
              <th className=" ">Address</th>
            </tr>
          </thead>

          <tbody>
            {substations.data && substations.data.map((sub, idx) => (
              <tr key={idx} className="border-b border-[#1A2B3C] hover:bg-[#1e1e2f]/50 transition">
                <td className="py-2 text-center  ">{idx + 1}</td>
                <td className=" text-center">{sub.substationId}</td>
                <td className=" text-center ">{sub.name}</td>
                <td className="text-center " title={sub.address}>
                  {sub.address?.split(",").slice(0, 2).join(",")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* MODAL */}
      {addSubstationModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-[#0D1422] p-6 rounded-xl w-[700px] border border-[#1A2B3C] space-y-4">

            <h3 className="font-semibold text-lg">Add Substation</h3>

            <input
              placeholder="Substation ID"
              className="w-full bg-[#1e1e2f] px-3 py-2 rounded"
              onChange={(e) => setForm({ ...form, substationId: e.target.value })}
            />

            <input
              placeholder="Name"
              className="w-full bg-[#1e1e2f] px-3 py-2 rounded"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />


            <div className="flex gap-2">
              <input
                placeholder="Search location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 bg-[#1e1e2f] px-3 py-2 rounded"
              />
              <button
                onClick={handleSearch}
                className="bg-[#7C3AED] px-3 rounded"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>

            {/* CURRENT LOCATION */}
            <button
              onClick={getCurrentLocation}
              className="text-sm text-blue-400"
            >
              Use Current Location
            </button>

            {/* MAP */}
            <div className="rounded overflow-hidden">
              <MapContainer
                center={[6.9271, 79.8612]}
                zoom={10}
                className="h-64 w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <FixMapSize />

                <LocationPicker
                  setForm={setForm}
                  setMarkerPos={setMarkerPos}
                />

                <FlyToLocation
                  position={markerPos}
                  shouldFly={shouldFly}
                  setShouldFly={setShouldFly}
                />

                {markerPos && (
                  <Marker
                    position={markerPos}
                    draggable
                    eventHandlers={{
                      dragend: (e) => {
                        const latlng = e.target.getLatLng();

                        setMarkerPos([latlng.lat, latlng.lng]);

                        setForm(prev => ({
                          ...prev,
                          latitude: latlng.lat,
                          longitude: latlng.lng
                        }));
                      }
                    }}
                  />
                )}
              </MapContainer>
            </div>

            {/* DISPLAY */}
            {form.latitude && (
              <p className="text-xs text-gray-400 w-full">
                <span className='flex gap-3 items-center '><MapPin /> {form.latitude}, {form.longitude} </span>
              </p>
            )}

            {form.address && (
              <p className="text-xs text-gray-400">
                <span className='flex gap-3 items-center '> <House /> {form.address}</span>
              </p>
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setAddSubstationModal(false)}
                className="px-3 py-2 text-sm text-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="text-white  hover:bg-[#5B21B6] cursor-pointer text-sm rounded-2xl py-2 px-5 bg-[#7C3AED]  transition"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Substations;