import { useState, useEffect } from 'react';
import { getOrders } from '../api';

const OrderList = ({ token }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const fetchedOrders = await getOrders(token);
                setOrders(fetchedOrders);
                setLoading(false);
            } catch (err) {
                console.error('Błąd przy pobieraniu zamówień:', err);
                setError('Nie udało się załadować zamówień.');
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    if (loading) return <div>Ładowanie zamówień...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-3">Lista Zamówień</h2>
            <table className="table table-striped table-bordered table-hover">
                <thead className="table-dark">
                <tr>
                    <th>ID Zamówienia</th>
                    <th>Data Potwierdzenia</th>
                    <th>Status</th>
                    <th>Klient</th>
                    <th>Email</th>
                    <th>Telefon</th>
                    <th>Produkty</th>
                    <th>Opinie</th>
                </tr>
                </thead>
                <tbody>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.confirmedDate || 'Brak'}</td>
                            <td>{order.status.name}</td>
                            <td>{order.username}</td>
                            <td>{order.email}</td>
                            <td>{order.phone}</td>
                            <td>
                                <ul>
                                    {order.items.map((item, index) => (
                                        <li key={index}>
                                            {item.product.name} (x{item.quantity})
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                {order.opinions && order.opinions.length > 0 ? (
                                    <ul>
                                        {order.opinions.map((opinion, index) => (
                                            <li key={index}>
                                                Ocena: {opinion.rating}, Komentarz: {opinion.comment}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    'Brak opinii'
                                )}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8">Brak zamówień</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;
