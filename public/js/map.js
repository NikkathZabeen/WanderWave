

     
        mapboxgl.accessToken = mapToken;

        
      
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            center: coordinates,// starting position [lng, lat]. Note that lat must be set between -90 and 90
            style: 'mapbox://styles/mapbox/streets-v11', 
            zoom: 8// starting zoom
        });

        console.log(coordinates);

        const marker = new mapboxgl.Marker({color:'red'})
        .setLngLat(coordinates)
        .addTo(map);
