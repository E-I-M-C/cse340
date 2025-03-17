-- Add client into `account` table
INSERT INTO public.account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )
VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
  );

-- Modify account_type from `Client` to `Admin`
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- Remove client `account` table
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

-- Modify inv_description of GM Hummer
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

-- INNER JOIN data
SELECT inv_model, public.inventory.classification_id
FROM public.inventory
    INNER JOIN public.classification
    ON public.inventory.classification_id = public.classification.classification_id
WHERE public.classification.classification_name = 'Sport';

-- Modify inv_image & inv_thumbnail of all data entries
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, 'images', 'images/vehicles'),
  inv_thumbnail = REPLACE(inv_thumbnail, 'images', 'images/vehicles');