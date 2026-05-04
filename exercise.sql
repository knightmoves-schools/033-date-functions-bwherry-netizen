SELECT *, date() as NEXT_EXPIRE_DATE FROM Grocery
WHERE date() <= date();
