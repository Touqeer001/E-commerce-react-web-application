import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import { getAllBanners } from "../../Services/api";
import "./HeroCarousel.css";

function HeroCarousel() {

    const [banners, setBanners] = useState([]);
    
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await getAllBanners();
                setBanners(response.data.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBanners();
    }, []);

   

    return (
        <Swiper
            modules={[Navigation]}
            navigation
            loop
        >
            {banners.map((banner) => (
                <SwiperSlide key={banner.id}>
                    <div
                        className="hero-slide"
                        style={{ background: banner.backgroundColor }}
                    >
                        <div className="hero-content">
                            <h1>{banner.title}</h1>
                            <p>{banner.subtitle}</p>
                            
                        </div>

                        <div className="hero-image">
                            <img
                                src={banner.image}
                                alt={banner.title}
                            />
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default HeroCarousel;