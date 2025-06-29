import React, { useState, useEffect } from 'react';

interface CarouselItem {
  id: number;
  image: string;
  icon: string;
  title: string;
  description: string;
}

const Carousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: CarouselItem[] = [
    {
      id: 1,
      image: '/image/carousel-1.jpg',
      icon: 'fas fa-camera',
      title: 'Get started with Argon',
      description: "There's nothing I really wanted to do in life that I wasn't able to get good at."
    },
    {
      id: 2,
      image: '/image/carousel-2.jpg',
      icon: 'fas fa-lightbulb',
      title: 'Faster way to create web pages',
      description: "That's my skill. I'm not really specifically talented at anything except for the ability to learn."
    },
    {
      id: 3,
      image: '/image/carousel-3.jpg',
      icon: 'fas fa-trophy',
      title: 'Share with us your design tips!',
      description: "Don't be afraid to be wrong because you can't learn anything from a compliment."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="card h-100 admin-card">
      <div className="card-body p-0 position-relative" style={{ height: '400px' }}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`position-absolute w-100 h-100 transition-all ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transition: 'opacity 0.5s ease-in-out' }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
            <div className="position-absolute bottom-0 start-0 end-0 p-4 text-white">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-white text-dark rounded p-2 me-3">
                  <i className={slide.icon}></i>
                </div>
                <h5 className="mb-0">{slide.title}</h5>
              </div>
              <p className="mb-0 opacity-75">{slide.description}</p>
            </div>
          </div>
        ))}

        <button
          className="btn btn-light position-absolute top-0 end-0 m-3"
          onClick={nextSlide}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
        <button
          className="btn btn-light position-absolute top-0 end-0 m-3"
          style={{ right: '60px' }}
          onClick={prevSlide}
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
          <div className="d-flex">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`btn btn-sm mx-1 ${
                  index === currentSlide ? 'btn-light' : 'btn-light opacity-50'
                }`}
                onClick={() => setCurrentSlide(index)}
                style={{ width: '8px', height: '8px', borderRadius: '50%' }}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel; 