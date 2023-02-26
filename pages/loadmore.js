import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";

export default function LoadMore() {
  
  const [data, setData] =  useState([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    async function loadData () {
      setLoading(true)
      await axios.get(`https://dummyjson.com/products?limit=12&skip=${page * 12}&select=title,images,description,price`).then((res) => {
        setData([...data, ...res.data.products])
        setLoading(false)  
      }).catch((err) => {
        console.log(err)
        setLoading(false)
      })
    }
    loadData()
  }, [page])

  const loadMore = async () => {
    setLoading(true)
    setPage(page+1)
    await axios.get(`https://dummyjson.com/products?limit=12&skip=${page * 12}&select=title,images,description,price`).then((res) => {
        setLoading(false)  
        setData([...res.data, data])  
      }).catch((err) => {
        console.log(err)
        setLoading(false)  
      })
  }
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
                  <small className="text-muted">RM {value.price}</small>
                </p>
                {value.description}
              </Card.Body>
          </Card>
        </Col>
      ))}
      </Row>
      <div className="d-grid gap-2 py-5">
        <Button variant="primary" onClick={loadMore} size="lg" disabled={loading}>
          {loading ? 'Loading...':'Load More'}
        </Button>
      </div>
      </Container>

    </>
  );
}