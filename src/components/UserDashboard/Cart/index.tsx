import { useAppDispatch, useAppSelector } from 'app/hooks';
import Category from 'components/Global/Category';
import Navbar from 'components/Global/Navbar';
import { addToCart, getCartItems, removeFromCart } from 'features/slices/userSlice';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import CheckOut from '../CheckOut';

import "./Cart.scss"

function Cart() {
    const dispatch = useAppDispatch();
    const state = useAppSelector((state) => state);
    const { id } = useParams();

    useEffect(() => {
        dispatch(getCartItems(state.auth.accessToken, id))
    }, [dispatch, id, state.auth.accessToken, state.user.carts])

    useEffect(() => {
        document.title="Cart";
    })

    const onRemoveItem = (bookId: string) => {
        dispatch(removeFromCart(state.auth.accessToken, bookId, id));
        alert("Remove successfully");
    }

    const onAddItem = (bookId: string) => {
        dispatch(addToCart(state.auth.accessToken, bookId, id));
        alert("Add successfully");
    }
    const orderDetail = state.user.carts && state.user.carts.filter((cart) => !cart.isPaid);
    let total = 0;

    return (
        <>
            <Navbar />
            <Category />
            {state.user.carts &&
                <div>
                    <section className="container">
                        <ul className="books">
                            {orderDetail.length > 0 ?
                                orderDetail[0].cartList.map((cart, index) => {
                                    total += cart.total;
                                    return (
                                        <li className="row" key={index}>
                                            <div className="col left">
                                                <div className="thumbnail">
                                                    <Link to={`/books/${cart.book.id}`}>
                                                        <img src={cart.book.thumbnail} alt={cart.book.title} />
                                                    </Link>
                                                </div>
                                                <div className="detail">
                                                    <div className="name">
                                                        <Link to={`/books/${cart.book.id}`}>
                                                            <span>{cart.book.title}</span></Link>
                                                    </div>
                                                    <div className="price"><span>
                                                        $ {cart.book.price}
                                                    </span></div>
                                                </div>
                                            </div>

                                            <div className="col right">
                                                <div className="quantity">
                                                    <button onClick={() => onRemoveItem(cart.book.id)} className="button button--mimas">
                                                        -
                                                    </button>
                                                    <p>{cart.quantity}</p>
                                                    <button onClick={() => onAddItem(cart.book.id)} className="button button--mimas">
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                }) : (<h1>
                                    There is no books in cart
                                </h1>)}
                        </ul>
                    </section>
                    <section className="container">
                        <div className="summary">
                            <ul>
                                <li className="total">
                                    Total <span>${(total).toFixed(2)}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="checkout">
                            <CheckOut />
                        </div>
                    </section>
                </div>
            }
        </>
    );
}

export default Cart;