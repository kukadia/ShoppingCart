// simulate getting products from DataBase
const products = [];
const sty = {
  textAlign: "center", backgroundColor: "black", color: "antiquewhite",

};
const btnSty = {
  textAlign: "center", backgroundColor: "black", color: "antiquewhite",
};
  //=========Cart=============
  const Cart = (props) => {
    const { Card, Accordion, Button, div } = ReactBootstrap;
    let data = props.location.data ? props.location.data : products;
    console.log(`data:${JSON.stringify(data)}`);
  
    return <Accordion defaultActiveKey="0">{list}</Accordion>;
  };
  
  const useDataApi = (initialUrl, initialData) => {
    const { useState, useEffect, useReducer } = React;
    const [url, setUrl] = useState(initialUrl);
  
    const [state, dispatch] = useReducer(dataFetchReducer, {
      isLoading: false,
      isError: false,
      data: initialData,
    });
    console.log(`useDataApi called`);
    useEffect(() => {
      console.log("useEffect Called");
      let didCancel = false;
      const fetchData = async () => {
        dispatch({ type: "FETCH_INIT" });
        try {
          const result = await axios(url);
          console.log("FETCH FROM URl");
          if (!didCancel) {
            dispatch({ type: "FETCH_SUCCESS", payload: result.data });
          }
        } catch (error) {
          if (!didCancel) {
            dispatch({ type: "FETCH_FAILURE" });
          }
        }
      };
      fetchData();
      return () => {
        didCancel = true;
      };
    }, [url]);
    return [state, setUrl];
  };
  const dataFetchReducer = (state, action) => {
    switch (action.type) {
      case "FETCH_INIT":
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case "FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case "FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      default:
        throw new Error();
    }
  };
  
  const Products = (props) => {
    const [items, setItems] = React.useState(products);
    const [cart, setCart] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    const [checkTotal, setCheckTotal] = React.useState('false');
    
    const {
      Card,
      Accordion,
      Button,
      Container,
      Row,
      Col,
      Image,
      Input,
      div,
    } = ReactBootstrap;
    //  Fetch Data
    const { Fragment, useState, useEffect, useReducer } = React;
    const [query, setQuery] = useState("http://localhost:1337/api/products");
    const [{ data, isLoading, isError }, doFetch] = useDataApi(
      "http://localhost:1337/api/products",
      {
        data: [],
      }
    );
    console.log(`Rendering Products ${JSON.stringify(data)}`);
    // Fetch Data
    const addToCart = (e) => {
      let name = e.target.name;
      let item = items.filter((item) => item.name == name);
      console.log(`add to Cart ${JSON.stringify(item)}`);
      setCart([...cart, item[0]]);
      setCheckTotal('true');
      //doFetch(query);
    };
    const deleteCartItem = (index) => {
      let newCart = cart.filter((item, i) => index != i);
      
      setCart(newCart);
      if(newCart.length==0) return setCheckTotal('false');
    };
    const photos = ["apple.png", "orange.png", "beans.png", "cabbage.png"];
  
    let list = items.map((item, index) => {
      //let n = index + 1049;
      //let url = "https://picsum.photos/id/" + n + "/50/50";
  
      return (
        <li key={index}>
          <Image src={photos[index % 4]} width={70} roundedCircle></Image>
          <input name={item.name} style={btnSty} type="submit" onClick={addToCart}></input>
         
          <Button  size="large" style={btnSty}>
            {item.name}: ${item.cost}  
          </Button>
          
          
        </li>
      );
    });
    let cartList = cart.map((item, index) => {
      return (
        <div className="card text-center" key={index}>
          <Card key={index}>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey={1 + index} style={{color: "black"}}>
                        {item.name}
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse
                      onClick={() => deleteCartItem(index)}
                      eventKey={1 + index}
                    >
                      <Card.Body>
                        ${item.cost} from {item.country}
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
        </div>
       
      );
    });
  
    let finalList = () => {
      let total = checkOut();
        // setTotal();
      let final = cart.map((item, index) => {
        return (
            
          <div key={index} index={index}>
            {item.name}
          </div>
        );
      });
      
      return { final, total };
    };
    
    const checkOut = () => {
      let costs = cart.map((item) => item.cost);
      const reducer = (accum, current) => accum + current;
      let newTotal = costs.reduce(reducer, 0);
      console.log(`total updated to ${newTotal}`);
      // setCheckTotal(true);
      // setCheckTotal(checker);
    //   setCart();
    

      return newTotal;
    };

    

    // TODO: implement the restockProducts function
    const restockProducts = (url) => {
        doFetch(url);

        const item2 =[];
      
        const item = data.data.forEach(e => item2.push(e.attributes));
        let newItems = item2.map((item) => {
          let { name, country, cost, instock } = item;
          return { name, country, cost, instock };
        });

        // const item = data.data.forEach(e => item2.push(e.attributes));
        // let newItems = item2.map((item) => {
        //   if(item.name!=items.name){
        //     let { name, country, cost, instock } = item;
        //     return { name, country, cost, instock };

        //   }
        //   else{
        //     items.instock+=item.instock;
        //   }
          
        // });
        console.log(`new items: ${JSON.stringify(newItems)}`);
        setItems([...items, ...newItems]);

    };

    function finalCheck(){

      if(checkTotal=='true') return 'btn btn-primary enabled';
      return 'btn btn-primary disabled';

    }
  

  
    return (
      <Container>
        <Row>
          <Col>
            <h1 style={sty}>Product List</h1>
            <ul style={{ listStyleType: "none" }}>{list}</ul>
          </Col>
          <Col>
            <h1 style={sty}>Cart Contents</h1>
            <Accordion>

              {cartList}
              
              </Accordion>
          </Col>
          <Col> {/*style="width: 18rem;"*/}
                <div className="card text-right">
                    <div className="card-body">
                      <h5 className="card-title">Cart for Checkout </h5>
                      <p className="card-text">CheckOut $ {finalList().total}</p>
                      <div> {finalList().total > 0 && finalList().final} </div>
                        <a href="#" className={finalCheck()} style={btnSty} onClick={()=>{
                          alert(`Thank you for shopping with us!`);
                          setCart([]);
                          // setItems('');
                          }}>Purchase!!</a>
                     
                     
                     </div>
                    </div>
                  
                  {/* <div className="card text-right">
                  <h1>Cart for Checkout </h1>
                      <Button onClick={checkOut}>CheckOut $ {finalList().total}</Button>
                      <h2>CheckOut $ {finalList().total}</h2>
                      <div> {finalList().total > 0 && finalList().final} </div>
                      <Button onClick={()=>{
                          alert(`Thank you for shopping with us!`);
                          setCart([]);
                          // setItems('');
                          }}>Final Checkout</Button>
                  </div> */}
            
          </Col>
        </Row>
        <Row>
          <form
            onSubmit={(event) => {
              restockProducts(`${query}`);
              console.log(`Restock called on ${query}`);
              event.preventDefault();
            }}
          >
            <input
              type="text"
              style={{width: 300 + 'px'}}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit">ReStock Products</button>
          </form>
        </Row>
      </Container>
    );
  };
  // ========================================
  ReactDOM.render(<Products />, document.getElementById("root"));
  