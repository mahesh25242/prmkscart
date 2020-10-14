<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http:www.w3.org/1999/xhtml">
    <?php if(is_array($data["data"]) && !empty($data["data"])){ ?>
        <?php foreach($data["data"] as $add){?>
            <url>
                <loc><?php echo 'https://myadds.in/'.$add["seo_url"];?></loc>
                <lastmod><?php echo date('Y-m-d', (($add["tbl"]["created"]) ? $add["tbl"]["created"] : time()) ); ;?></lastmod>
            </url>
        <?php }?>
    <?php } ?>
</urlset>
