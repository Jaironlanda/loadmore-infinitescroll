import axios from "axios";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Placeholder, Card, Container, Row, Col } from "react-bootstrap";

const DummyLoading = () => {
  const pl = []

  for (let i=0; i< 4; i++){
    pl.push(
      <Col sm={3} key={i} className={'p-2'}>
      <Card style={{height: 150}}>
          <Card.Body>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
            <Placeholder xs={6} /> <Placeholder xs={8} />
          </Placeholder>
          </Card.Body>
      </Card>
    </Col>
    )
  }
  return (
    <Row>
      {pl}
    </Row>
  )
}

export default function AutoLoadMore() {
  
  const [data, setData] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  
  const elRef = useRef(null)
  
  async function getData() {
    
    await axios.get(`https://dummyjson.com/products?limit=12&skip=${page * 12}&select=title,images,description,price`)
      .then((res) => {
        if (res.data.products.length == 0) {
          setHasMore(false)
        } else {
          // setData(data)
          setData([...data, ...res.data.products])
          setPage(page => page+1)
          console.log('page data:', data)
        }
      
      }).catch((err) => {
        console.log(err)
       
      })
  }

  useEffect(() => {
    
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.9
    }

    const obs = new IntersectionObserver((entries) => {
      const first = entries[0]
      if (first.isIntersecting && hasMore) {
        // setPage(page + 1)
        getData()
        
      } 
    }, options)
    console.log(data)
    if (elRef.current) {
      obs.observe(elRef.current)
    }
    return  () => {
      if (elRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        obs.unobserve(elRef.current)
      }
    }
    
  }, [page, elRef])

  return (
    <>
    <Container className={'py-5'}>
      <Link href={'/'}>Home Page</Link>
      <Row>
          {data && data.map((value, key) => (
            <Col sm={3} key={key} className={'p-2'}>
              <Card style={{height: 350}}>
                <Card.Img variant="top" src={value.images[0]} height={150} width={150}/>
                  <Card.Body>
                    <Card.Title>{value.title} </Card.Title>
                    <p>
                      <small className="text-muted">RM {value.price} {value.id}</small>
                    </p>
                    {value.description}
                  </Card.Body>
              </Card>
            </Col>
          ))}
          </Row>

        {/* {hasMore && (<div ref={elRef}><p>Loading ...</p></div>)} */}
        {hasMore && (<div ref={elRef}><DummyLoading /></div>)}
      </Container>
    </>
  );
}