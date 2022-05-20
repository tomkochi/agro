import ReactMapboxGl, { Marker, Popup } from "react-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";

const Map = ReactMapboxGl({
	accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
	logoPosition: "top-left",
});

const MapBox = () => {
	const [selected, setSelected] = useState(null);

	const data = [
		{
			coordinates: {
				lat: 10.0002326,
				long: 76.252221,
			},
			img: "https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587",
			title: "Location 1",
		},
		{
			coordinates: {
				lat: 10.0080148,
				long: 76.3027288,
			},
			img: "https://images.unsplash.com/photo-1542718786-2e81a9d3dfac?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587",
			title: "Location 2",
		},
	];

	return (
		<Map
			style="mapbox://styles/mapbox/outdoors-v11"
			fitBounds={[
				[76.3027288, 10.0080148],
				[76.252221, 10.0002326],
			]}
			fitBoundsOptions={{
				padding: { top: 100, bottom: 100, left: 100, right: 100 },
			}}
			containerStyle={{
				height: "100vh",
				width: "100vw",
			}}
		>
			{data.map((d, i) => (
				<div key={i}>
					<Marker
						coordinates={[d.coordinates.long, d.coordinates.lat]}
						anchor="bottom"
					>
						<img
							onClick={(e) => {
								e.preventDefault();
								setSelected(d);
							}}
							src="https://toppng.com/uploads/preview/map-marker-icon-600x-map-marker-11562939743ayfahlvygl.png"
							width="30"
							height="30"
							alt=""
						/>
					</Marker>
				</div>
			))}
			{selected ? (
				<Popup
					coordinates={[selected.coordinates.long, selected.coordinates.lat]}
					offset={{
						"bottom-left": [12, -38],
						bottom: [0, -38],
						"bottom-right": [-12, -38],
					}}
				>
					<h1>{selected.title}</h1>
					<img
						src={selected.img}
						width="150"
						height="100"
						style={{ objectFit: "cover" }}
						alt=""
					/>
					<button onClick={() => setSelected(null)}>X</button>
				</Popup>
			) : null}
		</Map>
	);
};

export default MapBox;
